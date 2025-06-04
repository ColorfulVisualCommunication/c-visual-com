from celery import Celery

# This function initializes a Celery application with the Flask application context.
# It allows Celery tasks to access the Flask application context, which is necessary for
# tasks that need to interact with Flask extensions (like database, mail, etc.).
# The function takes a Flask app instance as an argument and configures the Celery app
# with the Flask app's configuration settings.
def make_celery(app):
    celery_app = Celery(
        app.import_name,
        broker=app.config["CELERY_BROKER_URL"],
        backend=app.config["CELERY_RESULT_BACKEND"]
    )
    celery_app.conf.update(app.config)
    TaskBase = celery_app.Task

    class ContextTask(TaskBase):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return TaskBase.__call__(self, *args, **kwargs)
    celery_app.Task = ContextTask
    return celery_app