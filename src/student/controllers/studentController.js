const pool = require("../../../db")
const { getStudentsQ, getStudentQ, checkEmailQ, addStudentQ, deleteStudentQ, updateStudentQ, getStudentCount, getStudentsGroupQ } = require('../queries/studentQuieries');
const { getTeacherQ } = require("../queries/teacherQueries");
async function getStudents(req, res) {
    try {
        const page = +req.query.page || 1;
        const pageSize = +req.query.pageSize || 5;
        const offset = (page - 1) * pageSize;
        const countResult = await pool.query(getStudentCount)
        const data = await pool.query(getStudentsQ, [pageSize, offset]);

        res.status(200).json({
            data: data['rows'],
            totalStudents: parseInt(countResult.rows[0].count),
            page,
            pageSize,
        })

    } catch (error) {
        console.log(error)
    }

}

async function getStudentById(req, res) {
    try {
        const id = +req.params.id;
        const data = await pool.query(getStudentQ, [id])
        res.status(200).json(data.rows)

    } catch (error) {
        console.log(error)
    }

}
async function getStudentGroups(req, res) {
    try {
        const query = `
            SELECT t.id AS teacherid, t.name AS teachername,
                   s.id AS studentid, s.name AS studentname
            FROM teachers t
            LEFT JOIN students s ON t.id = s.teacherid
        `;

        const result = await pool.query(query);

        // Process the query result and send the response
        const groupedTeachers = []; // Initialize an array to hold grouped teachers

        result.rows.forEach(row => {
            const { teacherid, teachername, studentid, studentname } = row;

            // Check if the teacher exists in the groupedTeachers array
            const teacherExists = groupedTeachers.find(teacher => teacher.teacherid === teacherid);

            if (!teacherExists) {
                // If teacher doesn't exist, create a new teacher object
                const newTeacher = {
                    teacherid: teacherid,
                    teachername: teachername,
                    students: []
                };

                // If the row has student data, add the student to the teacher's students array
                if (studentid) {
                    newTeacher.students.push({
                        studentid: studentid,
                        studentname: studentname
                    });
                }

                // Push the new teacher object to the groupedTeachers array
                groupedTeachers.push(newTeacher);
            } else {
                // If teacher exists, add the student to the teacher's students array
                if (studentid) {
                    teacherExists.students.push({
                        studentid: studentid,
                        studentname: studentname
                    });
                }
            }
        });

        res.status(200).json(groupedTeachers);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred" });
    }

}

async function addStudent(req, res) {
    try {
        const {
            name,
            email,
            age,
            dob,
            teacherId
        } = req.body
        const checkUserExist = await pool.query(checkEmailQ, [email]);
        if (checkUserExist.rowCount) {
            return res.json({
                message: "email already exists"
            })
        }

        const teacherExists = await pool.query(getTeacherQ, [teacherId])
        if (teacherExists.rows.length === 0) {
            return res.status(400).json({
                message: "teacher not found"
            })
        }

        const data = await pool.query(addStudentQ, [name, email, age, dob, teacherExists.rows[0].name, teacherId])
        if (data.rowCount) {
            res.status(201).json({ message: "Sucesfully added" })
        }

    } catch (error) {
        console.log(error)
    }

}

async function deleteStudent(req, res) {
    try {
        const id = +req.params.id;
        const data = await pool.query(deleteStudentQ, [id])
        if (data.rowCount) {
            res.status(201).json({ message: "Sucesfully removed" })
        } else {
            res.status(404).json({ message: "Failed to remove" })
        }

    } catch (error) {
        console.log(error)
    }

}

async function updateStudent(req, res) {
    try {
        const id = +req.params.id;
        const { name } = req.body;
        const data = await pool.query(getStudentQ, [id])
        if (!data.rowCount) {
            res.status(201).json({ message: "user not exists" })
        } else {
            const deleteuser = await pool.query(updateStudentQ, [name, id])
            res.status(404).json({ message: "User Updated" })
        }

    } catch (error) {
        console.log(error)
    }

}

async function tryoutQueries(req, res) {
    try {
        /*
        //! Find the teacher(s) who have the most students:
        const queryStr = `SELECT id, name
        FROM teachers
        WHERE id = (
            SELECT teacherid
            FROM students
            GROUP BY teacherid
            ORDER BY COUNT(*) DESC
            LIMIT 1
        );`
        */
        // joining two tables on a related field
        // const queryStr = "SELECT s.name AS studentName ,t.name as teacherName FROM students s JOIN teachers t ON t.id = s.teacherid;"



        // left join two tables for finding teacher with no student
        //    const queryStr = "SELECT t.name ,t.id FROM teachers t LEFT JOIN students s ON t.id = s.teacherid WHERE s.id IS NULL"


        //aggregate COUNT and GROUP BY to count students for each teacher
        // const queryStr = "SELECT t.name ,COUNT(s.id) AS numOfStudent FROM teachers t LEFT JOIN students s ON t.id = s.teacherid GROUP BY t.name,t.id"

        //find by advance filters;
        // const queryStr = "SELECT name , age FROM students WHERE age > (SELECT AVG(age) FROM students )"

        
        const data = await pool.query(queryStr);
        console.table(data.rows);
        res.json({ data: data.rows })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getStudents,
    getStudentById,
    addStudent,
    deleteStudent,
    updateStudent,
    getStudentGroups,
    tryoutQueries
}