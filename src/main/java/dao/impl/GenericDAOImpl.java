package dao.impl;

import java.util.Date;

import utils.FileUtils;

import model.Day;

import com.alibaba.fastjson.JSON;

import dao.GenericDAO;

public class GenericDAOImpl implements GenericDAO {

	public Day load(Date date) {
		return JSON.parseObject(
				FileUtils.getInstance().readFile(
						"data/day/" + date.getTime() + ".json"), Day.class);
	}

	public void save(Day day) {
		FileUtils.getInstance().writeFile("data/day/"+day.getDate().getTime()+".json",
				JSON.toJSONString(day));
	}

}
