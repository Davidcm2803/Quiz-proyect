/**
 * @typedef {Object} Answer
 * @property {string} _id
 * @property {boolean} is_correct
 * @property {string} text
 * @property {string} question
 */

/**
 * @typedef {Object} Question
 * @property {string} _id
 * @property {number} points
 * @property {string} quiz
 * @property {string} text
 * @property {number} time
 */

/**
 * @typedef {Object} Quiz
 * @property {string} _id
 * @property {string} title
 * @property {string} description
 * @property {string} creator 
 * @property {Date} createdAt
 * @property {boolean} started
 * @property {Question[]} questions
 */

/**
 * @typedef {Object} CreateQuestionPayload
 * @property {string} quiz
 * @property {string} text
 * @property {number} points
 * @property {number} time
 */

/**
 * @typedef {Object} CreateAnswerPayload
 * @property {string} questionId
 * @property {string} text
 * @property {boolean} is_correct
 */

/**
 * @typedef {Object} CreateQuizPayload
 * @property {string} title
 * @property {string} description
 * @property {string} creator
 */