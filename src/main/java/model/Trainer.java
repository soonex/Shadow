package model;

import java.util.ArrayList;
import java.util.List;

public class Trainer {
	String name;
	List<Trainee> trainees = new ArrayList<Trainee>();

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Trainee> getTrainees() {
		return trainees;
	}

	public void setTrainees(List<Trainee> trainees) {
		this.trainees = trainees;
	}
}
