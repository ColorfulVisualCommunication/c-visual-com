"""Add image_url to Product

Revision ID: 250c0bea7f2f
Revises: 3093e40aacf0
Create Date: 2025-05-21 23:58:44.618233

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '250c0bea7f2f'
down_revision = '3093e40aacf0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('products', schema=None) as batch_op:
        batch_op.add_column(sa.Column('image_url', sa.String(length=255), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('products', schema=None) as batch_op:
        batch_op.drop_column('image_url')

    # ### end Alembic commands ###
