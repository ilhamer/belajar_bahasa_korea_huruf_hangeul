document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#hangeul-table tbody');
    const quizBtn = document.getElementById('quiz-btn');
    const quizContainer = document.getElementById('quiz-container');
    const playQuizBtn = document.getElementById('play-quiz-audio');
    const quizOptions = document.getElementById('quiz-options');

    let hangeulData = [];
    let currentQuizItem = null;

    // Muat data JSON
    fetch('data/hangeul.json')
        .then(response => response.json())
        .then(data => {
            hangeulData = data;
            renderTable();
        })
        .catch(error => console.error("Error loading data:", error));

    // Render tabel
    function renderTable() {
        tableBody.innerHTML = '';
        hangeulData.forEach(item => {
            const row = document.createElement('tr');
            row.className = item.jenis.includes('konsonan') ? 'konsonan' : 'vokal';

            row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.karakter}</td>
            <td>${item.jenis}</td>
            <td>${item.romanisasi.replace('_', '/')}</td>
            <td><button onclick="playAudio('${item.audio}')">🔊</button></td>
          `;
            tableBody.appendChild(row);
        });
    }

    // Fungsi audio global
    window.playAudio = function (audioPath) {
        new Audio(audioPath).play()
            .catch(e => console.error("Error playing audio:", e));
    };

    // Mode kuis
    quizBtn.addEventListener('click', () => {
        quizContainer.classList.toggle('hidden');
        if (!quizContainer.classList.contains('hidden')) {
            startQuiz();
        }
    });

    playQuizBtn.addEventListener('click', () => {
        if (currentQuizItem) {
            playAudio(currentQuizItem.audio);
        }
    });

    function startQuiz() {
        currentQuizItem = hangeulData[Math.floor(Math.random() * hangeulData.length)];
        document.getElementById('quiz-question').textContent =
            `Tebak pelafalan: ${currentQuizItem.romanisasi.replace('_', '/')}`;

        const options = [currentQuizItem.karakter];
        while (options.length < 3) {
            const randomChar = hangeulData[Math.floor(Math.random() * hangeulData.length)].karakter;
            if (!options.includes(randomChar)) options.push(randomChar);
        }

        quizOptions.innerHTML = options.sort(() => 0.5 - Math.random())
            .map(opt => `<button class="quiz-option" data-correct="${opt === currentQuizItem.karakter}">${opt}</button>`)
            .join('');

        document.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('click', function () {
                const isCorrect = this.getAttribute('data-correct') === 'true';
                document.getElementById('quiz-result').textContent =
                    isCorrect ? '✅ Benar!' : '❌ Salah! Coba lagi.';
                if (isCorrect) setTimeout(startQuiz, 1000);
            });
        });
    }

    // Flashcard Logic
    let currentCardIndex = 0;
    let flashcards = [];

    // Init flashcards dari data JSON
    function initFlashcards() {
        flashcards = hangeulData.map(item => ({
            char: item.karakter,
            romaji: item.romanisasi,
            audio: item.audio
        }));
        updateProgressIndicator(); // Inisialisasi pertama
        updateFlashcard();
    }

    // Update tampilan flashcard
    function updateFlashcard() {
        const card = flashcards[currentCardIndex];
        document.getElementById('flashcard-char').textContent = card.char;
        document.getElementById('flashcard-romaji').textContent = card.romaji;
        document.getElementById('play-audio').setAttribute('data-audio', card.audio);

        // Reset animasi flip
        const flashcard = document.getElementById('flashcard');
        flashcard.classList.remove('flipped');
    }

    // Event Listeners
    document.getElementById('toggle-flashcard').addEventListener('click', () => {
        const section = document.getElementById('flashcard-section');
        section.classList.toggle('hidden');
    });

    document.getElementById('flashcard').addEventListener('click', function () {
        this.classList.toggle('flipped');
    });

    document.getElementById('prev-card').addEventListener('click', () => {
        currentCardIndex = (currentCardIndex - 1 + flashcards.length) % flashcards.length;
        updateFlashcard();
        updateProgressIndicator(); // Tambahkan ini
    });

    document.getElementById('next-card').addEventListener('click', () => {
        currentCardIndex = (currentCardIndex + 1) % flashcards.length;
        updateFlashcard();
        updateProgressIndicator(); // Tambahkan ini
    });

    document.getElementById('play-audio').addEventListener('click', function (e) {
        e.stopPropagation(); // Mencegah trigger flip
        playAudio(this.getAttribute('data-audio')); // Sesuai nama fungsi yang ada
    });

    // Panggil init saat data JSON siap
    fetch('data/hangeul.json')
        .then(response => response.json())
        .then(data => {
            hangeulData = data;
            initFlashcards();
        });

    function updateProgressIndicator() {
        document.getElementById('current-card').textContent = currentCardIndex + 1;
        document.getElementById('total-cards').textContent = flashcards.length;
    }

// 1. Pertahankan event listener existing Anda
document.getElementById('prev-card').addEventListener('click', () => {
    currentCardIndex = (currentCardIndex - 1 + flashcards.length) % flashcards.length;
    updateFlashcard();
    updateProgressIndicator(); // Tambahkan ini
});

document.getElementById('next-card').addEventListener('click', () => {
    currentCardIndex = (currentCardIndex + 1) % flashcards.length;
    updateFlashcard();
    updateProgressIndicator(); // Tambahkan ini
});

// 2. Fungsi updateProgressIndicator (baru)
function updateProgressIndicator() {
    document.getElementById('current-card').textContent = currentCardIndex + 1;
    document.getElementById('total-cards').textContent = flashcards.length;
}

// 3. Fungsi shuffleCards (modifikasi)
function shuffleCards() {
    // Acak array tanpa reference ke original
    const shuffled = [...flashcards];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    flashcards = shuffled;
    currentCardIndex = 0;
    updateFlashcard();
    updateProgressIndicator();
    
    // Animasi tombol
    const shuffleBtn = document.getElementById('shuffle-btn');
    shuffleBtn.style.transform = 'rotate(360deg)';
    setTimeout(() => shuffleBtn.style.transform = '', 500);
}

// 4. Panggil updateProgressIndicator saat inisialisasi
function initFlashcards() {
    flashcards = hangeulData.map(item => ({
        char: item.karakter,
        romaji: item.romanisasi,
        audio: item.audio
    }));
    updateProgressIndicator(); // Tambahkan ini
    updateFlashcard();
}
   // Di akhir file
   document.getElementById('shuffle-btn').addEventListener('click', shuffleCards);
});