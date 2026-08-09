
# Progress Report - Gestion RH avec Prédiction

## Étape 1 : Infrastructure
- [x] Docker Compose avec PostgreSQL 16.
- [x] Projet Spring Boot (Web, JPA, PostgreSQL, Lombok, Security).
- [x] Architecture en couches (controller, service, repository, entity, dto, config, exception).
- [x] Connexion réussie à PostgreSQL via DBeaver.

## Étape 2 : Entities & JPA Mapping (Terminé)
- [x] User, Departement, Role, Position.
- [x] Contrat, Leave, Presence.
- [x] Evaluation (avec deux relations ManyToOne vers User).
- [x] Objectif (lié à Evaluation).
- [x] PredictionAbsenteisme (lié à User).
- [x] Toutes les relations en FetchType.LAZY.
- [x] Auditing activé avec @EnableJpaAuditing.
- [x] Vérification des tables dans DBeaver.

## Étape 3 : Repository Layer
- [x] Création des interfaces JpaRepository pour les 10 entités.
- [x] Ajout des méthodes de recherche personnalisées (findByEmail, etc.).