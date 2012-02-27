import model.Day;

import java.util.Calendar;
import java.util.Date;
import java.util.List;


enum Week {
	SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THUSDAY, FRIDAY, SATURDAY;

	private Date now;
	private Calendar today;
	private List<Day> days;

	Week() {
		now = new Date();
		today = Calendar.getInstance();
		today.setTime(now);
	}

	public Date getNow() {
		return now;
	}

	public void setNow(Date now) {

		this.now = now;
	}

	public Calendar getToday() {
		return today;
	}

	public void setToday(Calendar today) {
		this.today = today;
	}

	public List<Day> getDays() {
		return days;
	}

	public void setDays(List<Day> days) {
		this.days = days;
	}

}