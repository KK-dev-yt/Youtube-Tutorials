from flask import Flask, jsonify, request

app = Flask(__name__)

# Dummy database (in-memory)
students = [
    {"id": 1, "name": "Arun", "age": 21, "course": "Computer Science"},
    {"id": 2, "name": "Arjun", "age": 22, "course": "Information Technology"}
]

# Function to find a student by ID
def find_student(student_id):
    return next((s for s in students if s["id"] == student_id), None)

# 1️⃣ GET - Get all students
@app.route("/students", methods=["GET"])
def get_students():
    return jsonify(students), 200

# 2️⃣ GET - Get one student by ID
@app.route("/students/<int:student_id>", methods=["GET"])
def get_student(student_id):
    student = find_student(student_id)
    if student:
        return jsonify(student), 200
    return jsonify({"error": "Student not found"}), 404

# 3️⃣ POST - Add a new student
@app.route("/students", methods=["POST"])
def add_student():
    data = request.get_json()
    if not data or "name" not in data or "age" not in data or "course" not in data:
        return jsonify({"error": "Missing name, age, or course"}), 400

    new_id = max([s["id"] for s in students], default=0) + 1
    new_student = {
        "id": new_id,
        "name": data["name"],
        "age": data["age"],
        "course": data["course"]
    }
    students.append(new_student)
    return jsonify(new_student), 201

# 4️⃣ PUT - Update a student's details
@app.route("/students/<int:student_id>", methods=["PUT"])
def update_student(student_id):
    student = find_student(student_id)
    if not student:
        return jsonify({"error": "Student not found"}), 404

    data = request.get_json()
    student["name"] = data.get("name", student["name"])
    student["age"] = data.get("age", student["age"])
    student["course"] = data.get("course", student["course"])
    return jsonify(student), 200

# 5️⃣ DELETE - Remove a student
@app.route("/students/<int:student_id>", methods=["DELETE"])
def delete_student(student_id):
    student = find_student(student_id)
    if not student:
        return jsonify({"error": "Student not found"}), 404

    students.remove(student)
    return jsonify({"message": "Student deleted successfully"}), 200

# Root route
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to the Student API"}), 200

if __name__ == "__main__":
    app.run(debug=True)
