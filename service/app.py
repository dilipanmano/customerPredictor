from flask import Flask, request, jsonify, make_response
from flask_restplus import Api, Resource, fields
from sklearn.externals import joblib
import numpy as np
import sys

flask_app = Flask(__name__)
app = Api(app = flask_app, 
		  version = "1.0", 
		  title = "ML React App", 
		  description = "Predict results using a trained model")

name_space = app.namespace('prediction', description='Prediction APIs')

model = app.model('Prediction params', 
				  {'Recency': fields.Float(required = True, 
				  							   description="Recency Value", 
    					  				 	   help="Recency Value cannot be blank"),
				  'Frequency': fields.Float(required = True, 
				  							   description="Frequency Value", 
    					  				 	   help="Frequency Value cannot be blank"),
				  'Monetary': fields.Float(required = True, 
				  							description="Monetary Value", 
    					  				 	help="Monetary Value cannot be blank"),
				  })

classifier = joblib.load('classifier.joblib')

@name_space.route("/")
class MainClass(Resource):

	def options(self):
		response = make_response()
		response.headers.add("Access-Control-Allow-Origin", "*")
		response.headers.add('Access-Control-Allow-Headers', "*")
		response.headers.add('Access-Control-Allow-Methods', "*")
		return response

	@app.expect(model)		
	def post(self):
		try: 
			formData = request.json
			data = [val for val in formData.values()]
			prediction = classifier.predict(np.array(data).reshape(1, -1))
			types = { 0: "Loyal", 1: "NotLoyal"}
			response = jsonify({
				"statusCode": 200,
				"status": "Prediction made",
				"result": "The type of Loyalty is: " + types[prediction[0]]
				})
			response.headers.add('Access-Control-Allow-Origin', '*')
			return response
		except Exception as error:
			return jsonify({
				"statusCode": 500,
				"status": "Could not make prediction",
				"error": str(error)
			})