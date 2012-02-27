package utils;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class MsgUtils {

	public static String getMsg(String key){
		Properties properties = new Properties();
		InputStream inputStream = Thread.currentThread().getContextClassLoader()
				.getResourceAsStream("msg.properties");
		BufferedInputStream br = new BufferedInputStream(inputStream);
		try {
			properties.load(br);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return properties.getProperty(key);
	}
}
