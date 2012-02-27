package utils;

import javax.servlet.http.HttpServletRequest;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.zip.GZIPOutputStream;

public class Compress {
	public boolean isSurpported(HttpServletRequest request) {
		String encodingString = request.getHeader("Accept-Encoding");
		return (encodingString != null)
				&& (encodingString.contains("gzip"));
	}

	public byte[] compress(String data) throws IOException {

		ByteArrayOutputStream bout = new ByteArrayOutputStream();
		GZIPOutputStream gzip = new GZIPOutputStream(bout);

		gzip.write(data.getBytes());
		gzip.flush();
		gzip.close();

		bout.flush();
		bout.close();

		byte[] buf = bout.toByteArray();
		return buf;
	}
}
