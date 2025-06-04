from flask_mail import Message
from flask import render_template, current_app
from app.extensions import mail
from celery_worker import celery
from celery import Task
from typing import cast

@celery.task(bind=True, max_retries=3)
def send_email(self, to, subject, template, context):
    try:
        msg = Message(
            subject,
            recipients=[to],
            sender=current_app.config["MAIL_DEFAULT_SENDER"]
        )
        msg.html = render_template(f"emails/{template}", **context)
        mail.send(msg)
    except Exception as exc:
        self.retry(exc=exc, countdown=60)

def send_email_async(to, subject, template, context):
    task: Task = cast(Task, send_email)
    task.delay(to, subject, template, context)