const pool = require("../../../db");
const { addTeacherQ, checkEmailQ, getTeachersQ, getTeacherCount, getTeacherQ, updateTeacherQ } = require("../queries/teacherQueries");

async function addTeacher(req, res) {
    try {
        const {
            name,
            email,
            age,
            subject
        } = req.body
        const checkUserExist = await pool.query(checkEmailQ,[email]);
        if(checkUserExist.rowCount){
            return res.json({
                message:"email already exists"
            })
        }
        const data = await pool.query(addTeacherQ,[name,email,age,subject])
        if(data.rowCount){
            res.status(201).json({message:"Sucesfully added"})
        }

    } catch (error) {
        console.log(error)
    }

}

async function getTeachers(req, res) {
    try {
        const page = +req.query.page || 1;
        const pageSize = +req.query.pageSize || 5;
        const offset = (page-1 )* pageSize;
        const countResult = await pool.query(getTeacherCount)
        const data = await pool.query(getTeachersQ,[pageSize,offset]);

        res.status(200).json({
            data:data['rows'],
            totalTeachers:parseInt(countResult.rows[0].count),
            page,
            pageSize,
        })

    } catch (error) {
        console.log(error)
    }

}

async function getTeacherById(req, res) {
    try {
        const id = +req.params.id;
        const data = await pool.query(getTeacherQ,[id])
        res.status(200).json(data.rows)

    } catch (error) {
        console.log(error)
    }

}



async function updateTeacher(req, res) {
    try {
        const id = +req.params.id;
        const {name,subject} = req.body;
        const data = await pool.query(getTeacherQ,[id])
        if(!data.rowCount){
            res.status(201).json({message:"Teacher not exists"})
        }else{
            const updateTeacher = await pool.query(updateTeacherQ,[name,subject,id])
            res.status(404).json({message:"Teacher Updated"})
        }

    } catch (error) {
        console.log(error)
    }

}


module.exports = {
    addTeacher,
    getTeachers,
    getTeacherById,
    updateTeacher
}