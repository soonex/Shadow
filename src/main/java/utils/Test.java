package utils;

import java.io.IOException;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.methods.GetMethod;

public class Test {

	public static void testGet() throws HttpException, IOException{
		  HttpClient http = new HttpClient();
		  GetMethod get = new GetMethod("http://127.0.0.1/ETS/script/jquery-1.6.2.min.js");
		  try{
		  get.addRequestHeader("accept-encoding", "gzip,deflate");
		  get.addRequestHeader("user-agent", "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 1.0.3705; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2; .NET4.0C; .NET4.0E)");
		  int er = http.executeMethod(get);
		  if(er==200){
		   System.out.println(get.getResponseContentLength());
		   String html = get.getResponseBodyAsString();
//		   System.out.println(html);
		   System.out.println(html.getBytes().length);
		  }
		}finally{
		   get.releaseConnection();
		}
	}
}
