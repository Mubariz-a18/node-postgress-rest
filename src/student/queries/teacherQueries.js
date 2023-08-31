module.exports = {
    getTeachersQ : "SELECT * FROM teachers LIMIT $1 OFFSET $2",
    getTeacherCount:"SELECT COUNT(*) FROM teachers",
    getTeacherQ : "SELECT * FROM teachers WHERE id=$1",
    addTeacherQ:"INSERT INTO teachers (name,email,age,subject) VALUES ($1,$2,$3,$4)",
    checkEmailQ:"SELECT s FROM teachers s WHERE s.email=$1",
    updateTeacherQ:"UPDATE teachers SET name = $1, subject = $2 WHERE id = $3"
}