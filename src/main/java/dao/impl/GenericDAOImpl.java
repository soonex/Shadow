package dao.impl;

import com.alibaba.fastjson.JSON;
import dao.GenericDAO;
import model.Day;
import utils.FileUtils;

import java.util.Date;

public class GenericDAOImpl implements GenericDAO {

    public Day load(Date date) {
        //get  day info  from  json file
        String dayInfo = FileUtils.getInstance().readFile(
                "data/day/" + date.getTime() + ".json");
        if (null == dayInfo) {  // if the file is not existed, clone from 0.json file
            Day day = this.load(new Date(0));
            day.setDate(date);
            this.save(day);
            return day;
        } else {
            return JSON.parseObject(dayInfo, Day.class);
        }
    }

    public void save(Day day) {
        FileUtils.getInstance().writeFile("data/day/" + day.getDate().getTime() + ".json",
                JSON.toJSONString(day));
    }

}
