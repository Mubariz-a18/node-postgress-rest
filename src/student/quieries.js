module.exports = {
    getStudentsQ : "SELECT * FROM students",
    getStudentQ : "SELECT * FROM students WHERE id=$1",
    addStudentQ:"INSERT INTO students (name,email,age,dob) VALUES ($1,$2,$3,$4)",
    checkEmailQ:"SELECT s FROM students s WHERE s.email=$1",
    deleteStudentQ:"DELETE FROM students WHERE id = $1",
    updateStudentQ:"UPDATE students SET name = $1 WHERE id = $2"
}