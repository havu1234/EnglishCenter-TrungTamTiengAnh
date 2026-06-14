/**
 * Student Routes
 * API endpoints for student management
 */

const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
// Uncomment when you want to add authentication
// const { authenticate } = require('../middleware/auth');
// const { authorize } = require('../middleware/rbac');

/**
 * @route   GET /api/students
 * @desc    Get all students
 * @access  Public (change to Private later)
 */
router.get('/', studentController.getAllStudents);

/**
 * @route   GET /api/students/search
 * @desc    Search students
 * @access  Public
 */
router.get('/search', studentController.searchStudents);

/**
 * @route   GET /api/students/:id
 * @desc    Get student by ID
 * @access  Public
 */
router.get('/:id', studentController.getStudentById);

/**
 * @route   POST /api/students
 * @desc    Create new student
 * @access  Public (change to Private later)
 */
router.post('/', studentController.createStudent);

/**
 * @route   PUT /api/students/:id
 * @desc    Update student
 * @access  Public (change to Private later)
 */
router.put('/:id', studentController.updateStudent);

/**
 * @route   DELETE /api/students/:id
 * @desc    Delete student
 * @access  Public (change to Private later)
 */
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
