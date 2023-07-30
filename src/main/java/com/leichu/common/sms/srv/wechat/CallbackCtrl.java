package com.leichu.common.sms.srv.wechat;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/webchat/callback")
public class CallbackCtrl {

	@GetMapping("")
	public String get(String req) {
		log.info("Get >>> {}", req);
		return "success";
	}

	@PostMapping("")
	public String post(String req) {
		log.info("Post >>> {}", req);
		return "success";
	}

}
