package com.joborbit.chat.util;

import java.time.LocalDateTime;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class DateTimeUtil {

    public static LocalDateTime now() {
        return LocalDateTime.now();
    }

}