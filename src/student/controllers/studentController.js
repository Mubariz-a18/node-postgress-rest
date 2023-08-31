const pool = require("../../../db")
const { getStudentsQ, getStudentQ, checkEmailQ, addStudentQ, deleteStudentQ, updateStudentQ, getStudentCount } = require('../queries/studentQuieries')
async function getStudents(req, res) {
    try {
        const page = +req.query.page || 1;
        const pageSize = +req.query.pageSize || 5;
        const offset = (page-1 )* pageSize;
        const countResult = await pool.query(getStudentCount)
        const data = await pool.query(getStudentsQ,[pageSize,offset]);

        res.status(200).json({
            data:data['rows'],
            totalStudents:parseInt(countResult.rows[0].count),
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
        const data = await pool.query(getStudentQ,[id])
        res.status(200).json(data.rows)

    } catch (error) {
        console.log(error)
    }

}


async function addStudent(req, res) {
    try {
        const {
            name,
            email,
            age,
            dob,
            teacherName,
            teacherId
        } = req.body
        const checkUserExist = await pool.query(checkEmailQ,[email]);
        if(checkUserExist.rowCount){
            return res.json({
                message:"email already exists"
            })
        }
        const data = await pool.query(addStudentQ,[name,email,age,dob,teacherName,teacherId])
        if(data.rowCount){
            res.status(201).json({message:"Sucesfully added"})
        }

    } catch (error) {
        console.log(error)
    }

}

async function deleteStudent(req, res) {
    try {
        const id = +req.params.id;
        const data = await pool.query(deleteStudentQ,[id])
        if(data.rowCount){
            res.status(201).json({message:"Sucesfully removed"})
        }else{
            res.status(404).json({message:"Failed to remove"})
        }

    } catch (error) {
        console.log(error)
    }

}

async function updateStudent(req, res) {
    try {
        const id = +req.params.id;
        const {name} = req.body;
        const data = await pool.query(getStudentQ,[id])
        if(!data.rowCount){
            res.status(201).json({message:"user not exists"})
        }else{
            const deleteuser = await pool.query(updateStudentQ,[name,id])
            res.status(404).json({message:"User Updated"})
        }

    } catch (error) {
        console.log(error)
    }

}


module.exports = {
    getStudents,
    getStudentById,
    addStudent,
    deleteStudent,
    updateStudent
}