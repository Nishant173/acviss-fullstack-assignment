from typing import Callable, Optional
import functools
import time
import traceback

from rest_framework import status
from rest_framework.response import Response


def timer(func: Callable) -> Callable:
    """Decorator that prints the runtime of the decorated function"""
    @functools.wraps(func)
    def wrapper_timer(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        time_taken_in_secs = round(end - start, 3)
        print(f"Executed {func.__name__!r} in: {time_taken_in_secs} secs")
        return result
    return wrapper_timer


def api_endpoint_exception_handler(
        api_endpoint_description: str,
        print_response: Optional[bool] = False,
    ) -> Callable:
    """
    Decorator that handles exceptions that may occur in function based API endpoints.
    Expects a function that takes in a `rest_framework.request.Request` object, and
    returns a `rest_framework.response.Response` object.
    If an exception is encountered, then a response with status code 500 is returned.
    """
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs) -> Response:
            try:
                response_obj = func(*args, **kwargs)
            except Exception as exc:
                response = {
                    'exception_type': type(exc).__name__,
                    'exception_msg': ' | '.join(exc.args),
                    'api_endpoint_function_name': func.__name__,
                    'api_endpoint_description': api_endpoint_description,
                    'traceback_string': traceback.format_exc(),
                }
                response_obj = Response(data=response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            if print_response:
                print(f"Response(data={response_obj.data}, status={response_obj.status_code})")
            return response_obj
        return wrapper
    return decorator