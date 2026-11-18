package org.vixir.common;

import java.time.Instant;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Public smoke-test endpoint used by CI and the deploy health check. */
@RestController
@RequestMapping("/api/v1")
public class PingController {
    @GetMapping("/ping")
    public Map<String, Object> ping() {
        return Map.of("status", "ok", "service", "vixir-api", "time", Instant.now().toString());
    }
}
