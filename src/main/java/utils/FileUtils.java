package utils;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.Serializable;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class FileUtils implements Serializable {

	private static final long serialVersionUID = 1L;
	
	protected final Logger logger = LoggerFactory.getLogger(getClass());
	
	private BufferedWriter bw;
	private BufferedReader br;

	private static class FileDBMgrHolder {
		static final FileUtils INSTANCE = new FileUtils();
	}

	public static FileUtils getInstance() {
		return FileDBMgrHolder.INSTANCE;
	}

	private FileUtils() {
	}

	private Object readResolve() {
		return getInstance();
	}

	public static File getFile(String fileName) {
		String filePath = Thread.currentThread().getContextClassLoader()
				.getResource("").getPath();

		filePath += fileName;
		File file = new File(filePath);
		if (file.exists() != false) {
			try {
				file.createNewFile();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return file;
	}

	public String readFile(String fileName) {
		File file = getFile(fileName);

		/* io */
		StringBuilder stringBuilder = new StringBuilder();
		try {
			br = new BufferedReader(new InputStreamReader(new FileInputStream(
					file)));
			String str = null;
			while ((str = br.readLine()) != null) {
				stringBuilder.append(str);
				str = null;
			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				br.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		/* nio */
		// FileChannel fileChannel = null;
		// MappedByteBuffer mappedByteBuffer = null;
		// StringBuilder stringBuilder = null;
		// try {
		// fileChannel = new FileInputStream(file).getChannel();
		// mappedByteBuffer = fileChannel.map(FileChannel.MapMode.READ_ONLY,
		// 0, fileChannel.size());
		// stringBuilder = new StringBuilder();
		// while (mappedByteBuffer.hasRemaining()) {
		// stringBuilder.append((char) mappedByteBuffer.get());
		// }
		// } catch (FileNotFoundException e) {
		// e.printStackTrace();
		// } catch (IOException e) {
		// e.printStackTrace();
		// } finally {
		// mappedByteBuffer.flip();
		// mappedByteBuffer.clear();
		// try {
		// fileChannel.close();
		// } catch (IOException e) {
		// e.printStackTrace();
		// }
		// }
		return stringBuilder.toString();
	}

	public void writeFile(String fileName, String data) {
		if (data.getBytes().length > 525) {
			System.out.println(data);
		}
		File file = getFile(fileName);
		/* nio */
		// FileChannel fileChannel = null;
		// MappedByteBuffer mappedByteBuffer = null;
		// try {
		// fileChannel = new RandomAccessFile(file, "rw").getChannel();
		// // ByteBuffer buffer = ByteBuffer.allocate(1024);
		// // buffer.flip();
		// // buffer.put(data.getBytes());
		// mappedByteBuffer = fileChannel.map(FileChannel.MapMode.READ_WRITE,
		// 0, data.getBytes().length);
		// mappedByteBuffer.put(data.getBytes(), 0, data.getBytes().length);
		// fileChannel.write(mappedByteBuffer);
		// } catch (FileNotFoundException e) {
		// e.printStackTrace();
		// } catch (IOException e) {
		// e.printStackTrace();
		// } finally {
		// mappedByteBuffer.flip();
		// mappedByteBuffer.clear();
		// try {
		// fileChannel.close();
		// } catch (IOException e) {
		// e.printStackTrace();
		// }
		// }

		/* io */
		try {
			bw = new BufferedWriter(new OutputStreamWriter(
					new FileOutputStream(file)));
			bw.write(data);
			bw.flush();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				bw.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

	}

}
