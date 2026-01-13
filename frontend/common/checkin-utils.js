/**
 * 打卡工具类
 */

// 获取当前日期字符串 (YYYY-MM-DD)
export function getCurrentDateString() {
	const date = new Date();
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// 根据打卡周期获取下一个打卡日期
export function getNextCheckinDate(checkinPeriod, lastCheckinDate = null) {
	const now = new Date();
	
	if (!lastCheckinDate) {
		lastCheckinDate = now;
	} else {
		lastCheckinDate = new Date(lastCheckinDate);
	}
	
	let nextDate = new Date(now);
	
	switch (checkinPeriod) {
		case 'daily':
			// 下一天
			nextDate.setDate(lastCheckinDate.getDate() + 1);
			break;
		case 'weekly':
			// 下周同一天
			nextDate.setDate(lastCheckinDate.getDate() + 7);
			break;
		case 'monthly':
			// 下个月同一天
			nextDate.setMonth(lastCheckinDate.getMonth() + 1);
			break;
		default:
			// 默认为每天
			nextDate.setDate(lastCheckinDate.getDate() + 1);
	}
	
	return nextDate;
}

// 检查指定日期是否已打卡
export function hasCheckedIn(checkinPeriod, lastCheckinDate, targetDate = null) {
	if (!lastCheckinDate) return false;
	
	const lastDate = new Date(lastCheckinDate);
	if (!targetDate) {
		targetDate = new Date();
	} else {
		targetDate = new Date(targetDate);
	}
	
	// 设置时间为0点0分0秒
	const lastCheckinDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
	const targetDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
	
	switch (checkinPeriod) {
		case 'daily':
			return lastCheckinDay.getTime() === targetDay.getTime();
		case 'weekly':
			// 检查是否在同一周
			const lastWeekStart = getWeekStart(lastCheckinDay);
			const targetWeekStart = getWeekStart(targetDay);
			return lastWeekStart.getTime() === targetWeekStart.getTime();
		case 'monthly':
			// 检查是否在同一月
			return lastCheckinDay.getFullYear() === targetDay.getFullYear() &&
			       lastCheckinDay.getMonth() === targetDay.getMonth();
		default:
			return lastCheckinDay.getTime() === targetDay.getTime();
	}
}

// 获取一周的开始日期（周一）
function getWeekStart(date) {
	const day = date.getDay();
	const weekStart = new Date(date);
	// 如果是周日(0)，则调整为上周一
	const diff = day === 0 ? -6 : 1 - day;
	weekStart.setDate(date.getDate() + diff);
	return weekStart;
}

// 获取剩余时间字符串
export function getTimeRemaining(endTime) {
	const now = new Date().getTime();
	const endTimeMs = new Date(endTime).getTime();
	const timeDiff = endTimeMs - now;
	
	if (timeDiff <= 0) {
		return '0秒';
	}
	
	const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
	const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
	
	let timeString = '';
	if (days > 0) timeString += `${days}天`;
	if (hours > 0) timeString += `${hours}小时`;
	if (minutes > 0) timeString += `${minutes}分钟`;
	if (seconds > 0 || timeString === '') timeString += `${seconds}秒`;
	
	return timeString;
}