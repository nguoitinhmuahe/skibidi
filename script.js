// script.js
const homeBtn = document.getElementById('home-btn');
const shareBtn = document.getElementById('share-btn');
const toggleBgBtn = document.getElementById('toggle-bg-btn');
const homeSection = document.getElementById('home-section');
const shareSection = document.getElementById('share-section');
const loadingOverlay = document.getElementById('loading');
const userIpElement = document.getElementById('user-ip');
const downloadButtons = document.querySelectorAll('.download-btn');

// Hiển thị IP người dùng
fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
        userIpElement.innerHTML = `Địa chỉ IP của bạn: ${data.ip}`;
    })
    .catch(error => {
        userIpElement.innerHTML = `Không thể lấy IP: ${error.message}`;
    });

// Tạo hoặc lấy HWID cố định
function getOrCreateHWID() {
    const hwidKey = 'hwid_fixed';
    let hwid = localStorage.getItem(hwidKey);
    if (!hwid) {
        // Tạo HWID mới dựa trên User-Agent và một chuỗi ngẫu nhiên
        const userAgent = navigator.userAgent;
        const randomStr = Math.random().toString(36).substring(2, 15);
        hwid = btoa(userAgent + randomStr);
        localStorage.setItem(hwidKey, hwid); // Lưu HWID cố định
    }
    return hwid;
}

// Quản lý lượt tải xuống
function manageDownloads() {
    const hwid = getOrCreateHWID();
    const storageKey = `download_${hwid}`;
    let downloadData = JSON.parse(localStorage.getItem(storageKey)) || {
        count: 0,
        resetTime: null
    };

    const now = Date.now();
    const thirtyHours = 30 * 60 * 60 * 1000; // 30 tiếng tính bằng milliseconds

    // Kiểm tra và reset nếu đã quá 30 tiếng
    if (downloadData.resetTime && now >= downloadData.resetTime) {
        downloadData = {
            count: 0,
            resetTime: null
        };
        localStorage.setItem(storageKey, JSON.stringify(downloadData));
    }

    downloadButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const currentTime = Date.now();

            // Kiểm tra lại thời gian reset
            if (downloadData.resetTime && currentTime >= downloadData.resetTime) {
                downloadData = {
                    count: 0,
                    resetTime: null
                };
            }

            if (downloadData.count >= 3 && (!downloadData.resetTime || currentTime < downloadData.resetTime)) {
                e.preventDefault();
                const timeLeft = Math.ceil((downloadData.resetTime - currentTime) / (60 * 60 * 1000));
                alert(`Bạn đã tải 3 file. Vui lòng đợi ${timeLeft} tiếng để tải thêm.`);
            } else {
                downloadData.count++;
                if (downloadData.count === 3) {
                    downloadData.resetTime = currentTime + thirtyHours;
                }
                localStorage.setItem(storageKey, JSON.stringify(downloadData));
                // Cho phép tải file
            }
        });
    });
}

// Gọi hàm quản lý tải xuống
manageDownloads();

// Chuyển đổi section
function showLoading() {
    loadingOverlay.classList.add('active');
    setTimeout(() => {
        loadingOverlay.classList.remove('active');
    }, 2000);
}

homeBtn.addEventListener('click', () => {
    showLoading();
    setTimeout(() => {
        homeSection.classList.add('active');
        shareSection.classList.remove('active');
        homeBtn.classList.add('active');
        shareBtn.classList.remove('active');
    }, 1000);
});

shareBtn.addEventListener('click', () => {
    showLoading();
    setTimeout(() => {
        shareSection.classList.add('active');
        homeSection.classList.remove('active');
        shareBtn.classList.add('active');
        homeBtn.classList.remove('active');
    }, 1000);
});

toggleBgBtn.addEventListener('change', () => {
    document.body.classList.toggle('dark');
});
