function updateClock() {
	const now = new Date();
	const day = now.getDate();
	const hours = now.getHours();
	const minutes = now.getMinutes();
	const seconds = now.getSeconds();
	const milliSeconds = now.getMilliseconds();

	// setClockUnit('day', day, 31, (hours * 3600 + minutes * 60 + seconds) / 86400);
	setClockUnit('hour', hours, 24, (minutes * 60 + seconds) / 3600);
	setClockUnit('minute', minutes, 60, (seconds * 1000 + milliSeconds) / 60000);
	setClockUnit('second', seconds, 60, milliSeconds / 1000);
	setClockUnit('millisecond', Math.floor(milliSeconds / 250), 4, (milliSeconds % 250) / 250, 1);

	const colons = document.querySelectorAll('.colon-class');
	const opacityValue = milliSeconds > 500 ? 0 : 1;

	colons.forEach(colon => {
		colon.style.opacity = opacityValue;
	});
}

function setClockUnit(id, current, modulator, fraction, length = 2) {
	var currenttag = 1;
	if (fraction > 0.5) {
		current = (current + 1) % modulator;
		fraction -= 1;
		currenttag = 0;
	}
	range = getComputedStyle(document.documentElement).getPropertyValue('--range');
	range = parseInt(range);
	const numdigits = range + range % 2 + 1;
	translate = (1 - range / numdigits) * -50;
	translate -= fraction * 100 / numdigits - 5;


	digits = []
	mid = Math.floor(numdigits / 2);
	for (let i = 0; i < numdigits; i++) {
		digit = (current + i - mid + modulator) % modulator;
		// digit = digit < 10 && length == 2 ? '0' + digit : digit;
		digit = digit.toString().padStart(length, '0');
		digits.push(digit);
	}

	// decs = `<u><b>`;
	// decf = `</u></b>`;
	decs = `<b>`;
	decf = `</b>`;

	if (currenttag) {
		digits[mid] = `${decs}${digits[mid]}${decf}`;
	} else {
		digits[mid - 1] = `${decs}${digits[mid - 1]}${decf}`;
	}

	document.getElementById(id).querySelector('.digit').innerHTML = digits.join('<br>');
	document.getElementById(id).querySelector('.digit').style.transform = `translateY(${translate}%)`;
}
const intervalId = setInterval(() => {
	updateClock();  // 立即更新一次
}, 1000 / 60); // 每隔1秒执行60次

document.addEventListener('DOMContentLoaded', function () {
	const clockContainer = document.getElementById('clockContainer');

	// const parts = ['hour', 'colon1', 'minute', 'colon2', 'second', 'colon3', 'millisecond']; 
	// const parts_without_colon = ['hour', 'minute', 'second', 'millisecond'];
	const parts_without_colon = ['hour', 'minute', 'second'];

	let parts = [];
	parts_without_colon.forEach((part) => {
		parts.push(part);
		parts.push('colon' + Math.random().toString(36).substring(2, 10));
	});
	parts.pop();  // 移除最后一个冒号

	parts.forEach(part => {
		const clockUnit = document.createElement('div');
		clockUnit.className = 'clock-unit';
		clockUnit.id = part;

		const digit = document.createElement('div');
		digit.className = 'digit';

		const gradientTop = document.createElement('div');
		gradientTop.className = 'gradient-top';

		const gradientBottom = document.createElement('div');
		gradientBottom.className = 'gradient-bottom';

		if (/^colon/.test(part)) {
			clockUnit.classList.add('colon-class');  // 添加共同的类名
			digit.style.transform = 'translateY(var(--transmid))';
			digit.textContent = ':';
		}

		clockUnit.appendChild(digit);
		clockUnit.appendChild(gradientTop);
		clockUnit.appendChild(gradientBottom);

		clockContainer.appendChild(clockUnit);
	});

	updateClock();  // 初始化时钟的值
});

const themeToggler = document.getElementById('theme-toggler');
const themeToggleIcon = themeToggler.querySelector('i');

function setTheme(theme) {
	if (theme === 'dark') {
		document.documentElement.setAttribute('data-theme', 'dark');
		themeToggleIcon.classList.remove('fa-moon');
		themeToggleIcon.classList.add('fa-sun');
	} else {
		document.documentElement.removeAttribute('data-theme');
		themeToggleIcon.classList.remove('fa-sun');
		themeToggleIcon.classList.add('fa-moon');
	}
}

// 当用户点击切换按钮时
themeToggler.addEventListener('click', () => {
	const currentTheme = document.documentElement.getAttribute('data-theme');
	if (currentTheme === 'dark') {
		setTheme('light');
		localStorage.setItem('theme', 'light'); // 保存用户选择到localStorage
	} else {
		setTheme('dark');
		localStorage.setItem('theme', 'dark'); // 保存用户选择到localStorage
	}
});

// 当页面加载时, 检查用户的主题选择
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
	setTheme(currentTheme);
} else {
	setTheme('dark');
}

function updateRootVariables() {
	const root = document.documentElement;

	// 判断当前设备是手机还是电脑
	const isMobile = window.matchMedia('(max-width: 768px)').matches;

	// 示例计算 - 您可以根据需要修改这些
	const size = window.innerWidth * 0.1; // 假设根据窗口宽度的5%来计算
	const range = Math.floor(window.innerHeight * 0.75 / size); // 假设根据窗口高度的10%来计算
	const transmid = (range - 1) * 50; // 您的原始计算

	// 设置新的变量值
	root.style.setProperty('--size', `${size}px`);
	root.style.setProperty('--range', range);
	root.style.setProperty('--transmid', `${transmid}%`);
}


const setFullHeight = () => {
	document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}

window.addEventListener('resize', setFullHeight);
setFullHeight(); // 初始调用

window.addEventListener('load', updateRootVariables);
window.addEventListener('resize', updateRootVariables);


