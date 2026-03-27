package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication  // Remove the exclude part
public class HostelManagementApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(HostelManagementApplication.class, args);
    }
}
