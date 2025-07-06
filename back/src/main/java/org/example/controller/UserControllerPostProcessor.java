package org.example.controller;

import org.example.dto.UserProfileDto;
import org.example.trash.RusPhone;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.lang.reflect.Field;
import java.lang.reflect.Proxy;
import java.util.Arrays;

@Component
public class UserControllerPostProcessor implements BeanPostProcessor {
    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        return BeanPostProcessor.super.postProcessAfterInitialization(bean, beanName);
    }
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        try {
            Field f = Arrays.stream(bean.getClass().getDeclaredFields())
                    .filter(field -> field.isAnnotationPresent(RusPhone.class))
                    .findFirst().orElse(null);
            String rusPhone = f.getAnnotation(RusPhone.class).value();
            if (!f.toString().startsWith(rusPhone)) {
                throw new RuntimeException("Номер телефона должен начинаться с " + rusPhone); // custom exception...
            }
        } catch (RuntimeException e) {
            throw  new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
        return Proxy.newProxyInstance();
    }
}
