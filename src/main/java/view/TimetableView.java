package view;

import com.alibaba.fastjson.JSON;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.servlet.view.AbstractView;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

@Controller("timetableView")
public class TimetableView extends AbstractView{
    protected final Logger logger = LoggerFactory.getLogger(getClass());

    @SuppressWarnings("rawtypes")
    @Override
    protected void renderMergedOutputModel(Map map, HttpServletRequest request,
                                           HttpServletResponse response) throws Exception {
        logger.info("render view");

        String data = JSON.toJSONString(map.get("result"));
        response.getOutputStream().print(data);
    }

}