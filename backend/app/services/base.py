from __future__ import annotations

from dataclasses import dataclass

from app.database.unit_of_work import UnitOfWork


@dataclass
class ServiceDependencies:
    uow: UnitOfWork
