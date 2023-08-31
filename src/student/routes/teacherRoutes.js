const {Router} = require('express');
const { addTeacher, getTeachers, getTeacherById, updateTeacher } = require('../controllers/teacherController');

const router = Router();

router.post('/addTeacher',addTeacher)
router.get('/',getTeachers)
router.get('/:id',getTeacherById)
router.put('/:id',updateTeacher)

module.exports = router;