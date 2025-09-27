// Quiz Logic JavaScript
class QuizSystem {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.questions = [];
        this.userAnswers = [];
        this.isCompleted = false;
        this.timeLimit = 0;
        this.timeRemaining = 0;
        this.timer = null;
    }

    initialize(questions, options = {}) {
        this.questions = questions;
        this.timeLimit = options.timeLimit || 0;
        this.timeRemaining = this.timeLimit;
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.isCompleted = false;
        
        this.render();
        if (this.timeLimit > 0) {
            this.startTimer();
        }
    }

    render() {
        const container = document.getElementById('quiz-container');
        if (!container) return;

        if (this.isCompleted) {
            this.renderResults();
            return;
        }

        const question = this.questions[this.currentQuestion];
        if (!question) return;

        container.innerHTML = `
            <div class="quiz-header">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(this.currentQuestion / this.questions.length) * 100}%"></div>
                </div>
                <div class="quiz-info">
                    <span>السؤال ${this.currentQuestion + 1} من ${this.questions.length}</span>
                    ${this.timeLimit > 0 ? `<span id="timer">الوقت المتبقي: ${this.formatTime(this.timeRemaining)}</span>` : ''}
                </div>
            </div>
            <div class="question-container">
                <h3 class="question-title">${question.question}</h3>
                <div class="choices">
                    ${question.choices.map((choice, index) => `
                        <button class="choice" data-choice="${index}">
                            ${choice}
                        </button>
                    `).join('')}
                </div>
            </div>
            <div class="quiz-controls">
                <button id="prev-btn" ${this.currentQuestion === 0 ? 'disabled' : ''}>السابق</button>
                <button id="next-btn" disabled>التالي</button>
            </div>
        `;

        this.attachEventListeners();
    }

    attachEventListeners() {
        // Choice selection
        const choices = document.querySelectorAll('.choice');
        choices.forEach(choice => {
            choice.addEventListener('click', (e) => {
                const choiceIndex = parseInt(e.target.dataset.choice);
                this.selectAnswer(choiceIndex);
            });
        });

        // Navigation buttons
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousQuestion());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }
    }

    selectAnswer(choiceIndex) {
        // Clear previous selections
        document.querySelectorAll('.choice').forEach(choice => {
            choice.classList.remove('selected');
        });

        // Select current choice
        const selectedChoice = document.querySelector(`[data-choice="${choiceIndex}"]`);
        if (selectedChoice) {
            selectedChoice.classList.add('selected');
        }

        // Store answer
        this.userAnswers[this.currentQuestion] = choiceIndex;

        // Enable next button
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) {
            nextBtn.disabled = false;
        }

        // Play sound
        if (window.IUGApp && window.IUGApp.playGlobalSound) {
            window.IUGApp.playGlobalSound('correct');
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.render();
        }
    }

    nextQuestion() {
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.render();
        } else {
            this.completeQuiz();
        }
    }

    completeQuiz() {
        this.isCompleted = true;
        this.stopTimer();
        this.calculateScore();
        this.render();
        
        // Play completion sound
        if (window.IUGApp && window.IUGApp.playGlobalSound) {
            window.IUGApp.playGlobalSound('badge');
        }
    }

    calculateScore() {
        this.score = 0;
        this.questions.forEach((question, index) => {
            if (this.userAnswers[index] === question.correctAnswer) {
                this.score++;
            }
        });
    }

    renderResults() {
        const container = document.getElementById('quiz-container');
        if (!container) return;

        const percentage = Math.round((this.score / this.questions.length) * 100);
        const passed = percentage >= 60;

        container.innerHTML = `
            <div class="quiz-results">
                <h2>نتائج الاختبار</h2>
                <div class="score-display">
                    <div class="score-circle ${passed ? 'passed' : 'failed'}">
                        <span class="score-percentage">${percentage}%</span>
                        <span class="score-fraction">${this.score}/${this.questions.length}</span>
                    </div>
                </div>
                <div class="result-message">
                    ${passed ? 
                        '<p class="success">تهانينا! لقد اجتزت الاختبار بنجاح</p>' :
                        '<p class="failure">لم تحصل على الدرجة المطلوبة. حاول مرة أخرى</p>'
                    }
                </div>
                <div class="quiz-actions">
                    <button id="retry-btn">إعادة الاختبار</button>
                    <button id="review-btn">مراجعة الإجابات</button>
                    <button id="continue-btn" ${!passed ? 'disabled' : ''}>المتابعة</button>
                </div>
            </div>
        `;

        // Attach result event listeners
        const retryBtn = document.getElementById('retry-btn');
        const reviewBtn = document.getElementById('review-btn');
        const continueBtn = document.getElementById('continue-btn');

        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.retryQuiz());
        }

        if (reviewBtn) {
            reviewBtn.addEventListener('click', () => this.reviewAnswers());
        }

        if (continueBtn && !continueBtn.disabled) {
            continueBtn.addEventListener('click', () => this.onQuizComplete());
        }

        // Save results
        this.saveResults();
    }

    retryQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.isCompleted = false;
        this.timeRemaining = this.timeLimit;
        this.render();
        
        if (this.timeLimit > 0) {
            this.startTimer();
        }
    }

    reviewAnswers() {
        const reviewContainer = document.createElement('div');
        reviewContainer.className = 'quiz-review';
        reviewContainer.innerHTML = `
            <h3>مراجعة الإجابات</h3>
            <div class="review-content">
                ${this.questions.map((question, index) => `
                    <div class="review-question">
                        <h4>السؤال ${index + 1}: ${question.question}</h4>
                        <div class="review-choices">
                            ${question.choices.map((choice, choiceIndex) => `
                                <div class="review-choice ${
                                    choiceIndex === question.correctAnswer ? 'correct' :
                                    choiceIndex === this.userAnswers[index] ? 'user-selected' : ''
                                }">
                                    ${choice}
                                    ${choiceIndex === question.correctAnswer ? ' ✓' : ''}
                                    ${choiceIndex === this.userAnswers[index] && choiceIndex !== question.correctAnswer ? ' ✗' : ''}
                                </div>
                            `).join('')}
                        </div>
                        ${question.explanation ? `<p class="explanation">${question.explanation}</p>` : ''}
                    </div>
                `).join('')}
            </div>
            <button onclick="this.parentElement.remove()">إغلاق</button>
        `;

        document.body.appendChild(reviewContainer);
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeRemaining--;
            const timerElement = document.getElementById('timer');
            if (timerElement) {
                timerElement.textContent = `الوقت المتبقي: ${this.formatTime(this.timeRemaining)}`;
            }

            if (this.timeRemaining <= 0) {
                this.completeQuiz();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    saveResults() {
        const results = {
            score: this.score,
            totalQuestions: this.questions.length,
            percentage: Math.round((this.score / this.questions.length) * 100),
            completedAt: new Date().toISOString(),
            userAnswers: this.userAnswers
        };

        try {
            localStorage.setItem('lastQuizResults', JSON.stringify(results));
        } catch (error) {
            console.log('Error saving quiz results:', error);
        }
    }

    onQuizComplete() {
        // Override this method to handle quiz completion
        if (window.IUGApp && window.IUGApp.showNotification) {
            window.IUGApp.showNotification('تم إكمال الاختبار بنجاح!', 'success');
        }
    }
}

// Initialize quiz system
document.addEventListener('DOMContentLoaded', function() {
    window.QuizSystem = QuizSystem;
});

// Export for global use
window.createQuiz = function(questions, options) {
    const quiz = new QuizSystem();
    quiz.initialize(questions, options);
    return quiz;
};