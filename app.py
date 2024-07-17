from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import re

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure SQLAlchemy for MySQL database
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:Kunal%40123@localhost/BlogApp'
db = SQLAlchemy(app)

# Initialize MongoDB client
client = MongoClient('mongodb://localhost:27017/')
db1 = client['Post']

# Define SQLAlchemy model for user registration details
class UserRegistrationDetails(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    emailId = db.Column(db.String(120), nullable=False, unique=True)
    contact = db.Column(db.String(15), nullable=False)
    password = db.Column(db.String(128), nullable=False)

# Test route to verify server is working
@app.route('/')
def index():
    return 'Working.....'

# Route for user signup
@app.route('/signUp', methods=['POST'])
def sign_up():
    user = request.json
    check = UserRegistrationDetails.query.filter_by(emailId=user['userEmailId']).first()
    if check:
        return jsonify({"message": "User account already exists with this Email Id"}), 400
    else:
        new_user = UserRegistrationDetails(
            emailId=user['userEmailId'],
            contact=user['userContact'],
            password=user['userPassword']
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": 'User Registration Successful'}), 200

# Route for user login
@app.route('/login', methods=['POST'])
def login():
    user = request.json
    check = UserRegistrationDetails.query.filter_by(emailId=user['userEmailId']).first()
    if check:
        if check.password == user['userPassword']:
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"message": "Incorrect password. Please try again"}), 400
    else:
        return jsonify({"message": 'No account exists with this Email Id. Please register'}), 400

# Route for adding a new blog post
@app.route('/addPost', methods=['POST'])
def add_post():
    blog_post = request.json
        
    image = blog_post.get('blogImageURL', '')
    image = image.strip()
    post = {
        'theme': blog_post.get('blogTheme', ''),
        'title': blog_post.get('blogTitle', ''),
        'description': blog_post.get('blogDescription', ''),
        'image': image,
        'author': {'id': blog_post.get('blogAuthorId', ''),'name': blog_post.get('blogAuthorName', '')},
        'likes' : 0,
    }
    
    result = db1.Blogs.insert_one(post)
    
    return jsonify({'message': "Successfully added post with id: ", 'postId': str(result.inserted_id)}), 200

# Route to get posts by a specific user
@app.route('/getPosts', methods=['POST'])
def get_posts():
    data = request.json
    emailId = data['loginId']

    fields_to_retrieve = {
        '_id': 1,
        'title': 1,
        'likes': 1,
        'image': 1,
    }
    posts = list(db1.Blogs.find({"author.id": emailId}, fields_to_retrieve))
    
    # Convert ObjectId to string
    for post in posts:
        post['_id'] = str(post['_id'])

    return jsonify({"message": "Successful", "posts": posts}), 200

# Route to get details of a new post by ID
@app.route('/getNewPost', methods=['POST'])
def get_new_post():
    data = request.json
    objId = ObjectId(data['newPost'])
    fields_to_retrieve = {
        '_id': 1,
        'title': 1,
        'likes': 1,
        'image': 1,
    }
    post = db1.Blogs.find_one({"_id": objId}, fields_to_retrieve)

    # Convert ObjectId to string
    post['_id'] = str(post['_id'])

    return jsonify({"message": "Successful", "post": post}), 200

# Route to get description of a post by ID
@app.route('/getDescription', methods=['POST'])
def get_description():
    data = request.json
    objId = ObjectId(data['postId'])

    fields_to_retrieve = {
        'description': 1,
        'author': 1,
    }
    description = db1.Blogs.find_one({"_id": objId}, fields_to_retrieve)
    
    # Convert ObjectId to string in the description if it's there
    if '_id' in description:
        description['_id'] = str(description['_id'])

    return jsonify({"message": "Successful", "description": description}), 200

# Route to update likes of a post
@app.route('/updateLikes', methods=['POST'])
def update_likes():
    data = request.json 
    _oid = ObjectId(data.get('postId'))
    new_likes = data.get('newLikes')
    flag = data.get('flag')
    userId = data.get('loginId')
    result = db1.Blogs.update_one(
            {'_id': _oid},  
            {'$set': {'likes': new_likes}}
    )

    if(flag):
        db1.PostLiked.update_one(
            {'_id': _oid},
            {'$push': {'likedIds': userId}},
            upsert=True
        )
    else:
        db1.PostLiked.update_one(
            {'_id': _oid},
            {'$pull': {'likedIds': userId}}
        )
    return jsonify({'message': 'Likes updated successfully for all posts'})

# Route to get featured posts by theme
@app.route('/getFeaturedPosts', methods=['POST'])
def get_featured_posts():
    fields_to_retrieve = {
        '_id': 1,
        'title': 1,
        'likes': 1,
        'image': 1,
        'theme': 1
    }

    pipeline = [
        {"$sort": {"_id": -1}},
        {"$project": fields_to_retrieve},
        {"$group": {
            "_id": "$theme",
            "latestItems": {"$push": "$$ROOT"}
        }},
        {"$project": {
            "theme": "$_id",
            "latestItems": {"$slice": ["$latestItems", 3]}
        }}
    ]

    result = list(db1.Blogs.aggregate(pipeline))

    # Convert ObjectId to string for each post
    for theme_group in result:
        for post in theme_group['latestItems']:
            post['_id'] = str(post['_id'])

    return jsonify({"message": "Successful", "featured_posts": result}), 200

# Route to get posts by theme
@app.route('/getThemePosts', methods=['POST'])
def get_theme_posts():
    data = request.json
    theme = data.get('theme').lower()
    fields_to_retrieve = {
        '_id': 1,
        'title': 1,
        'likes': 1,
        'image': 1,
        'theme': 1
    }
    print(theme)
    result = db1.Blogs.find({'theme': theme}, fields_to_retrieve)
    posts = []
    for post in result:
        post['_id'] = str(post['_id'])
        posts.insert(0, post)
    
    return jsonify({"message": "Successful", "Theme_posts": posts}), 200

# Route to check if a user has liked a post
@app.route('/checkLikedStatus', methods=['POST'])
def checked_liked_status():
    data = request.json
    userId = data.get('loginId')
    postId = ObjectId(data.get('postId'))

    # Find the document with the given postId
    result = db1.PostLiked.find_one({'_id': postId})
    
    if result:
        # Check if postId is in the likedIds array
        if userId in result.get('likedIds', []):
            return jsonify({'message': 'True'})
        else:
            return jsonify({'message': 'False'})
    else:
        return jsonify({'message': 'False'})

    return jsonify({message: 'False'})

# Main entry point of the application
if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Create tables within the application context
    app.run(debug=True)
