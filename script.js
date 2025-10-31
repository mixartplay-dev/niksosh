// Статическая версия JavaScript для GitHub Pages
document.addEventListener('DOMContentLoaded', function() {
    const mainScreen = document.getElementById('mainScreen');
    const invitationContent = document.getElementById('invitationContent');
    const rsvpForm = document.getElementById('rsvpForm');
    
    // Инициализация EmailJS
    (function() {
        emailjs.init("YOUR_PUBLIC_KEY"); // Замените на ваш публичный ключ EmailJS
    })();
    
    // Показ контента при клике на главный экран
    mainScreen.addEventListener('click', function() {
        mainScreen.classList.add('hidden');
        invitationContent.classList.add('visible');
        
        // Запуск таймера обратного отсчета
        startCountdown();
        
        // Запуск эффекта печатающегося текста
        setTimeout(typeWriterEffect, 500);
    });
    
    // Обработка формы RSVP
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Сбор данных формы
        const formData = new FormData(rsvpForm);
        const surname = formData.get('surname');
        const name = formData.get('name');
        const attendance = formData.get('attendance');
        
        // Валидация на клиенте
        if (!surname || !name || !attendance) {
            showErrorMessage('Пожалуйста, заполните все обязательные поля');
            return;
        }
        
        // Показываем индикатор загрузки
        showLoadingIndicator();
        
        // Отправка через EmailJS
        sendEmailViaEmailJS(surname, name, attendance);
    });
    
    // Функция отправки через EmailJS
    function sendEmailViaEmailJS(surname, name, attendance) {
        const attendanceText = (attendance === 'yes') ? 'Обязательно приду' : 'Не смогу присутствовать';
        
        const templateParams = {
            to_email: 'sarginik88@mail.ru',
            from_name: surname + ' ' + name,
            surname: surname,
            name: name,
            attendance: attendanceText,
            message: `Ответ на приглашение на юбилей школы (95 лет)
            
Фамилия: ${surname}
Имя: ${name}
Присутствие: ${attendanceText}
Дата и время ответа: ${new Date().toLocaleString('ru-RU')}

Это автоматическое сообщение с сайта приглашения.`
        };
        
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
            .then(function(response) {
                hideLoadingIndicator();
                showSuccessMessage('Ваш ответ успешно отправлен! Мы получили ваше подтверждение и очень ждем встречи с вами!');
                rsvpForm.reset();
                
                // Сохраняем резервную копию
                const backupData = {
                    timestamp: new Date().toISOString(),
                    surname: surname,
                    name: name,
                    attendance: attendance,
                    method: 'EmailJS'
                };
                localStorage.setItem('rsvpBackup', JSON.stringify(backupData));
            })
            .catch(function(error) {
                hideLoadingIndicator();
                console.error('Ошибка EmailJS:', error);
                
                // Пробуем альтернативный метод
                tryAlternativeMethod(surname, name, attendance);
            });
    }
    
    // Альтернативный метод отправки данных
    function tryAlternativeMethod(surname, name, attendance) {
        // Сохраняем данные локально
        const backupData = {
            timestamp: new Date().toISOString(),
            surname: surname,
            name: name,
            attendance: attendance,
            method: 'localStorage_backup'
        };
        
        localStorage.setItem('rsvpBackup', JSON.stringify(backupData));
        
        // Показываем сообщение с инструкциями
        showErrorMessage(`
            Не удалось отправить ответ автоматически. 
            Ваши данные сохранены локально. 
            Пожалуйста, свяжитесь с нами по телефону:
            Директор: +7 (964) 429-21-90
            Организатор: +7 (964) 076-37-40
        `);
        
        // Показываем кнопку для повторной попытки
        showRetryButton();
    }
    
    // Функция показа сообщения об успехе
    function showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                color: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                margin: 20px 0;
                box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
            ">
                <h3 style="margin-bottom: 10px; font-family: 'Playfair Display', serif;">
                    Спасибо за ваш ответ!
                </h3>
                <p style="margin: 0; opacity: 0.9;">
                    ${message || 'Мы получили ваше подтверждение и очень ждем встречи с вами!'}
                </p>
            </div>
        `;
        
        rsvpForm.parentNode.insertBefore(successDiv, rsvpForm.nextSibling);
        
        // Автоматическое скрытие через 8 секунд
        setTimeout(() => {
            successDiv.remove();
        }, 8000);
    }
    
    // Функция показа сообщения об ошибке
    function showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
                color: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                margin: 20px 0;
                box-shadow: 0 5px 15px rgba(244, 67, 54, 0.3);
            ">
                <h3 style="margin-bottom: 10px; font-family: 'Playfair Display', serif;">
                    Ошибка отправки
                </h3>
                <p style="margin: 0; opacity: 0.9;">
                    ${message}
                </p>
            </div>
        `;
        
        rsvpForm.parentNode.insertBefore(errorDiv, rsvpForm.nextSibling);
        
        // Автоматическое скрытие через 6 секунд
        setTimeout(() => {
            errorDiv.remove();
        }, 6000);
    }
    
    // Функция показа индикатора загрузки
    function showLoadingIndicator() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-indicator';
        loadingDiv.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                margin: 20px 0;
                box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
            ">
                <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                    <div style="
                        width: 20px;
                        height: 20px;
                        border: 2px solid rgba(255,255,255,0.3);
                        border-top: 2px solid white;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    "></div>
                    <span>Отправляем ваш ответ...</span>
                </div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        
        rsvpForm.parentNode.insertBefore(loadingDiv, rsvpForm.nextSibling);
    }
    
    // Функция скрытия индикатора загрузки
    function hideLoadingIndicator() {
        const loadingDiv = document.querySelector('.loading-indicator');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }
    
    // Функция показа кнопки повторной попытки
    function showRetryButton() {
        const retryDiv = document.createElement('div');
        retryDiv.className = 'retry-section';
        retryDiv.innerHTML = `
            <div style="
                background: rgba(255, 255, 255, 0.1);
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                margin: 20px 0;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
            ">
                <h3 style="color: white; margin-bottom: 15px; font-family: 'Playfair Display', serif;">
                    Попробовать еще раз?
                </h3>
                <button onclick="retrySubmission()" style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                    margin-right: 10px;
                ">
                    Повторить отправку
                </button>
                <button onclick="showContactInfo()" style="
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                ">
                    Связаться по телефону
                </button>
            </div>
        `;
        
        rsvpForm.parentNode.insertBefore(retryDiv, rsvpForm.nextSibling);
    }
    
    // Функция повторной отправки
    window.retrySubmission = function() {
        const retryDiv = document.querySelector('.retry-section');
        if (retryDiv) {
            retryDiv.remove();
        }
        
        // Получаем сохраненные данные
        const backupData = localStorage.getItem('rsvpBackup');
        if (backupData) {
            const data = JSON.parse(backupData);
            
            // Заполняем форму заново
            document.getElementById('surname').value = data.surname;
            document.getElementById('name').value = data.name;
            
            // Устанавливаем радио кнопки
            const attendanceRadio = document.querySelector(`input[name="attendance"][value="${data.attendance}"]`);
            if (attendanceRadio) {
                attendanceRadio.checked = true;
            }
            
            // Отправляем форму
            rsvpForm.dispatchEvent(new Event('submit'));
        }
    };
    
    // Функция показа контактной информации
    window.showContactInfo = function() {
        const contactDiv = document.createElement('div');
        contactDiv.className = 'contact-info-modal';
        contactDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 3000;
            ">
                <div style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    border-radius: 15px;
                    text-align: center;
                    max-width: 400px;
                    margin: 20px;
                ">
                    <h2 style="margin-bottom: 20px; font-family: 'Playfair Display', serif;">
                        Контактная информация
                    </h2>
                    <div style="margin-bottom: 15px;">
                        <strong>Директор ОУ:</strong><br>
                        <a href="tel:+79644292190" style="color: #FFD700; text-decoration: none;">
                            +7 (964) 429-21-90
                        </a>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <strong>Организатор:</strong><br>
                        <a href="tel:+79640763740" style="color: #FFD700; text-decoration: none;">
                            +7 (964) 076-37-40
                        </a>
                    </div>
                    <button onclick="this.parentElement.parentElement.remove()" style="
                        background: rgba(255, 255, 255, 0.2);
                        color: white;
                        border: 1px solid rgba(255, 255, 255, 0.3);
                        padding: 10px 20px;
                        border-radius: 8px;
                        cursor: pointer;
                    ">
                        Закрыть
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(contactDiv);
    };
    
    // Таймер обратного отсчета
    function startCountdown() {
        // Устанавливаем дату юбилея школы: 22 ноября 2025 в 13:00
        const eventDate = new Date('2025-11-22T13:00:00').getTime();
        
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = eventDate - now;
            
            if (distance < 0) {
                // Юбилей уже прошел
                document.getElementById('days').textContent = '0';
                document.getElementById('hours').textContent = '0';
                document.getElementById('minutes').textContent = '0';
                document.getElementById('seconds').textContent = '0';
                return;
            }
            
            // Вычисляем время
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Обновляем отображение
            document.getElementById('days').textContent = days;
            document.getElementById('hours').textContent = hours;
            document.getElementById('minutes').textContent = minutes;
            document.getElementById('seconds').textContent = seconds;
        }
        
        // Обновляем сразу
        updateCountdown();
        
        // Обновляем каждую секунду
        setInterval(updateCountdown, 1000);
    }
    
    // Добавление эффекта печатающегося текста для заголовка
    function typeWriterEffect() {
        const title = document.querySelector('.invitation-header h1');
        const text = title.textContent;
        title.textContent = '';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                title.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 50);
    }
    
    // Добавление функции сохранения данных формы в localStorage
    function saveFormData() {
        const formInputs = rsvpForm.querySelectorAll('input');
        
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                const formData = new FormData(rsvpForm);
                const data = Object.fromEntries(formData.entries());
                localStorage.setItem('weddingRSVP', JSON.stringify(data));
            });
        });
        
        // Восстановление данных при загрузке
        const savedData = localStorage.getItem('weddingRSVP');
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const input = rsvpForm.querySelector(`[name="${key}"]`);
                if (input) {
                    if (input.type === 'radio') {
                        const radio = rsvpForm.querySelector(`[name="${key}"][value="${data[key]}"]`);
                        if (radio) radio.checked = true;
                    } else {
                        input.value = data[key];
                    }
                }
            });
        }
    }
    
    // Инициализация сохранения данных формы
    saveFormData();
    
    // Анимация появления элементов при прокрутке
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Наблюдаем за всеми секциями
        const sections = invitationContent.querySelectorAll('.event-details, .countdown-timer, .venue-section, .gifts-section, .rsvp-section, .contacts-section');
        
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    }
    
    // Инициализация анимаций после показа контента
    setTimeout(initScrollAnimations, 1000);
});

// Дополнительные утилиты
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
    
    if (match) {
        return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
    }
    
    return phone;
}

// Экспорт функций для возможного использования
window.WeddingInvitation = {
    formatPhoneNumber
};
