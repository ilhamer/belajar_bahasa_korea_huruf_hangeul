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
    window.playAudio = function(audioPath) {
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
            btn.addEventListener('click', function() {
                const isCorrect = this.getAttribute('data-correct') === 'true';
                document.getElementById('quiz-result').textContent = 
                    isCorrect ? '✅ Benar!' : '❌ Salah! Coba lagi.';
                if (isCorrect) setTimeout(startQuiz, 1000);
            });
        });
    }
});