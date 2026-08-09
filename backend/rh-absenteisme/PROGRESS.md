# Progress Report - Gestion RH avec Prédiction d'Absentéisme

## Étape 1 : Infrastructure & Setup
- [x] Docker Compose avec PostgreSQL 16-alpine.
- [x] Projet Spring Boot initialisé (Web, JPA, PostgreSQL, Lombok, Security).
- [x] Architecture en couches (controller, service, repository, entity, dto, mapper, config, exception).
- [x] Connexion réussie à PostgreSQL via DBeaver.
- [x] Activation de JPA Auditing (@EnableJpaAuditing).

## Étape 2 : Data Layer (Entities & Repositories)
- [x] Création de toutes les entités (10 tables) :
    - User, Departement, Role, Position.
    - Contrat, Leave, Presence.
    - Evaluation, Objective, PredictionAbsenteisme.
- [x] Mappage JPA avec relations ManyToOne/OneToMany (FetchType.LAZY).
- [x] Création des Enums (RoleName, UserStatus, ContratType, LeaveStatus, etc.).
- [x] Implémentation des interfaces Repository (JpaRepository) avec méthodes personnalisées (findByEmail, existsByPhoneNumber, etc.).

## Étape 3 : Business Layer (Services & Mappers) - Réalisé
- [x] Mise en place du pattern DTO (Request / Response).
- [x] Mise en place des Mappers (conversion Entity <-> DTO).
- [x] Service `DepartementService` : CRUD complet (GET, POST, PATCH, DELETE).
- [x] Service `RoleService` : CRUD complet.
- [x] Service `PositionService` : CRUD complet.
- [x] Service `UserService` : Inscription (Register) avec chiffrement du mot de passe (BCrypt).

## Étape 4 : API Layer (Controllers) - Réalisé
- [x] `DepartementController` (endpoints testés via Bruno).
- [x] `RoleController` (endpoints testés).
- [x] `PositionController` (endpoints testés).
- [x] `UserController` (/register) - prêt à être testé.

## Prochaines Étapes (À venir)
- [ ] Implémentation du `ContratService` (gestion des contrats liés aux utilisateurs).
- [ ] Implémentation du `LeaveService` (demandes de congé).
- [ ] Implémentation du `PresenceService` (gestion des présences).
- [ ] Implémentation du `EvaluationService` et `ObjectiveService`.
- [ ] Gestion globale des exceptions (@ControllerAdvice).
- [ ] Intégration de la validation des données (@Valid).