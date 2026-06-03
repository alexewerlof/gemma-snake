const GRID_SIZE = 20;
const BOARD_SIZE = 400;
const CELL_SIZE = BOARD_SIZE / GRID_SIZE;

class SnakeGame {
    constructor() {
        this.board = document.getElementById('game-board');
        this.scoreElement = document.getElementById('current-score');
        this.finalScoreElement = document.getElementById('final-score');
        this.overlay = document.getElementById('game-over-overlay');
        this.restartButton = document.getElementById('restart-button');

        this.snake = [];
        this.food = null;
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.gameInterval = null;
        this.isPlaying = false;

        this.initEventListeners();
    }

    initEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        this.restartButton.addEventListener('click', () => this.start());
    }

    handleKeyPress(e) {
        const key = e.key;
        if (['ArrowUp', 'w', 'W'].includes(key) && this.direction !== 'down') {
            this.nextDirection = 'up';
        } else if (['ArrowDown', 's', 'S'].includes(key) && this.direction !== 'up') {
            this.nextDirection = 'down';
        } else if (['ArrowLeft', 'a', 'A'].includes(key) && this.direction !== 'right') {
            this.nextDirection = 'left';
        } else if (['ArrowRight', 'd', 'D'].includes(key) && this.direction !== 'left') {
            this.nextDirection = 'right';
        }
    }

    start() {
        // Reset state
        this.snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.isPlaying = true;
        this.scoreElement.innerText = this.score;
        this.overlay.classList.add('hidden');
        this.board.innerHTML = '';

        this.spawnFood();
        
        if (this.gameInterval) clearInterval(this.gameInterval);
        this.gameInterval = setInterval(() => this.gameLoop(), 150);
    }

    spawnFood() {
        const x = Math.floor(Math.random() * GRID_SIZE);
        const y = Math.floor(Math.random() * GRID_SIZE);
        this.food = { x, y };

        // Ensure food doesn't spawn on snake body
        if (this.snake.some(segment => segment.x === x && segment.y === y)) {
            this.spawnFood();
            return;
        }

        const foodElement = document.createElement('div');
        foodElement.className = 'food';
        foodElement.style.left = `${x * CELL_SIZE}px`;
        foodElement.style.top = `${y * CELL_SIZE}px`;
        this.board.appendChild(foodElement);
    }

    gameLoop() {
        if (!this.isPlaying) return;

        this.updateDirection();
        this.moveSnake();
        this.checkCollisions();
        this.render();
    }

    updateDirection() {
        this.direction = this.nextDirection;
    }

    moveSnake() {
        const head = { ...this.snake[0] };

        if (this.direction === 'up') head.y -= 1;
        else if (this.direction === 'down') head.y += 1;
        else if (this.direction === 'left') head.x -= 1;
        else if (this.direction === 'right') head.x += 1;

        this.snake.unshift(head);

        if (this.food && head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.scoreElement.innerText = this.score;
            this.removeFood();
            this.spawnFood();
        } else {
            this.snake.pop();
        }
    }

    removeFood() {
        const foodElement = this.board.querySelector('.food');
        if (foodElement) {
            this.board.removeChild(foodElement);
        }
    }

    checkCollisions() {
        const head = this.snake[0];

        // Wall collisions
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
            this.gameOver();
            return;
        }

        // Self collision
        for (let i = 1; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                this.gameOver();
                return;
            }
        }
    }

    gameOver() {
        this.isPlaying = false;
        clearInterval(this.gameInterval);
        this.finalScoreElement.innerText = this.score;
        this.overlay.classList.remove('hidden');
    }

    render() {
        // Re-rendering the whole board for simplicity in this small project
        // A more optimized version would only update changed segments
        this.board.innerHTML = '';
        
        // Render food
        if (this.food) {
            const foodElement = document.createElement('div');
            foodElement.className = 'food';
            foodElement.style.left = `${this.food.x * CELL_SIZE}px`;
            foodElement.style.top = `${this.food.y * CELL_SIZE}px`;
            this.board.appendChild(foodElement);
        }

        // Render snake
        this.snake.forEach((segment, index) => {
            const segmentElement = document.createElement('div');
            segmentElement.className = 'snake-segment';
            if (index === 0) segmentElement.classList.add('snake-head');
            segmentElement.style.left = `${segment.x * CELL_SIZE}px`;
            segmentElement.style.top = `${segment.y * CELL_SIZE}px`;
            this.board.appendChild(segmentElement);
        });
    }
}

const game = new SnakeGame();
game.start();
