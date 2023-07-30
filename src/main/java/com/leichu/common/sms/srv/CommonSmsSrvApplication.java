package com.leichu.common.sms.srv;

import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.cli.Digest;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Enumeration;
import java.util.Map;
import java.util.TreeMap;

@Slf4j
@SpringBootApplication
@RestController
public class CommonSmsSrvApplication {

	public static void main(String[] args) {
		SpringApplication.run(CommonSmsSrvApplication.class, args);
	}

	@RequestMapping("")
	public String index(HttpServletRequest req) {
		log.info("index >>> {}", req.getQueryString());
		// signature=7fa6d921c8ed9ec90b0d09842390b7b16f9b0e17
		// echostr=1434992328269872886
		// timestamp=1690679462
		// nonce=606205920
		Map<String, String> paramMap = new TreeMap<>();
		Enumeration<String> parameterNames = req.getParameterNames();
		String signature = null;
		while (parameterNames.hasMoreElements()) {
			String element = parameterNames.nextElement();
			if (element.equals("signature")){
				signature = req.getParameter(element);
				continue;
			}
			paramMap.put(element, req.getParameter(element));
		}
		StringBuffer sb = new StringBuffer();
		for (Map.Entry<String, String> entry : paramMap.entrySet()) {
			sb.append(entry.getValue());
		}
		byte[] digest = DigestUtils.sha1(sb.toString().getBytes(StandardCharsets.UTF_8));
		String newSign = new String(digest, StandardCharsets.UTF_8);


		if (newSign.equals(signature)){
			return paramMap.get("echostr");
		}

		return "success";
	}

}
