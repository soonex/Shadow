package service.impl;

import java.util.Date;
import java.util.List;

import model.Day;
import model.Period;
import model.Trainee;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import dao.DayDAO;
import dao.impl.DayDAOImpl;

@Component("dayService")
public class DayServiceImpl implements service.DayService {

	protected final Logger logger = LoggerFactory.getLogger(getClass());

	public Day findByDate(Date date) {
		return new DayDAOImpl().findByDate(date);
	}

	public boolean isModified(Day dayFrom, Day dayTo, long lastModified) {
		return lastModified != dayFrom.getModified().getTime();
	}

	/**
	 * if the element in list is invalid then return false
	 */
	public boolean isSortable(Day dayFrom, Day dayTo, String name,
			int periodFrom, int periodTo, int posFrom, int posTo) {
		// logger.info("validate sortable");

		List<Period> periodsFrom = dayFrom.getPeriods();
		List<Period> periodsTo = dayTo.getPeriods();
		if (periodFrom >= periodsFrom.size() || periodFrom < 0)
			return false;
		if (periodTo >= periodsTo.size() || periodTo < 0)
			return false;

		Period periodfrom = periodsFrom.get(periodFrom);
		Period periodto = periodsTo.get(periodTo);

		List<Trainee> traineesFrom = periodfrom.getTrainees();
		List<Trainee> traineesTo = periodto.getTrainees();

		if (posFrom >= traineesFrom.size() || periodFrom < 0)
			return false;
		if (posTo > traineesTo.size() || posTo < 0)
			return false;

		// not the same one then return false
		if (!name.trim().equals(traineesFrom.get(posFrom).getName().trim())) {
			return false;
		}

		return true;
	}

	public boolean transfer(Day dayFrom, Day dayTo, String name,
			int periodFrom, int periodTo, int posFrom, int posTo) {
		if (isSortable(dayFrom, dayTo, name, periodFrom, periodTo, posFrom,
				posTo)) {
			List<Trainee> traineesFrom = dayFrom.getPeriods().get(periodFrom)
					.getTrainees();
			List<Trainee> traineesTo = dayTo.getPeriods().get(periodTo)
					.getTrainees();

			// move trainee from original period to aim
			// for (Trainee trainee : traineesFrom) {
			// if (name.trim().equals(trainee.getName())) {
			// traineesFrom.remove(trainee);
			// traineesTo.add(posTo, trainee);
			// break; // without this will occur
			// // ConcurrentModificationException
			// }
			// }
			for (int i = 0; i < traineesFrom.size(); ++i) {
				if (i == posFrom) {
					Trainee trainee = traineesFrom.get(i);
					if (name.trim().equals(trainee.getName())) {
						traineesFrom.remove(trainee);
						traineesTo.add(posTo, trainee);
						break; // without this will occur
								// ConcurrentModificationException
					}
				}
			}

			DayDAO dayDAO = new DayDAOImpl();
			dayDAO.save(dayFrom);
			dayDAO.save(dayTo);
			return true;
		}

		return false;
	}
}
