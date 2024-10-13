package com.product.server.koi_control_application.serviceInterface;

import reactor.core.publisher.Flux;

public interface ISSEService<T> {
    void emitEvent(T event);
    Flux<T> getEventStream();
}
