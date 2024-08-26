from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import logging,logging,os
from pymongo import MongoClient
from abc import ABC, abstractmethod

class ITodoService(ABC):

    @abstractmethod
    def get_all_todos(self):
        pass

    @abstractmethod
    def create_todo_item(self, todo_data):
        pass

class MongoTodoService(ITodoService):

    def __init__(self, db):
        self.todo_collection = db['todo_items']

    def get_all_todos(self):
        try:
            return list(self.todo_collection.find({}, {"_id": 0}))
        except Exception as e:
            logging.error(f"Error retrieving todos: {str(e)}")
            raise

    def create_todo_item(self, todo_data):
        try:
            self.todo_collection.insert_one(todo_data)
        except Exception as e:
            logging.error(f"Error creating todo: {str(e)}")
            raise

class TodoServiceFactory:
    @staticmethod
    def create_service():
        mongo_uri = 'mongodb://' + os.environ["MONGO_HOST"] + ':' + os.environ["MONGO_PORT"]
        db = MongoClient(mongo_uri)['test_db']
        return MongoTodoService(db)

class TodoListView(APIView):
    def __init__(self, todo_service=None):
        self.todo_service = todo_service or TodoServiceFactory.create_service()

    def get(self, request):
        try:
            todos = self.todo_service.get_all_todos()
            return Response(todos, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "An error occurred while retrieving todos."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def post(self, request):
        try:
            todo_data = request.data
            self.todo_service.create_todo_item(todo_data)
            return Response({"message": "Todo item created successfully."}, status=status.HTTP_201_CREATED)
        except Exception:
            return Response({"error": "An error occurred while creating the todo item."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
