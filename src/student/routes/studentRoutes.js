const express = require('express')
const {getStudents, getStudentById, addStudent, deleteStudent, updateStudent} = require('../controllers/studentController')

const router = express.Router();

router.get('/',getStudents)
router.post('/',addStudent)
router.get('/:id',getStudentById)
router.delete('/:id',deleteStudent)
router.put('/:id',updateStudent)

module.exports = router;
