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

### Services de base (CRUD complets)
- [x] `DepartementService` : CRUD complet (GET, POST, PATCH, DELETE) avec DTO et Mapper.
- [x] `RoleService` : CRUD complet.
- [x] `PositionService` : CRUD complet.

### Service Utilisateur (CRUD complet + Sécurité)
- [x] `UserService` :
  - [x] `getAllUsers()` : liste de tous les utilisateurs.
  - [x] `getUserById()` : récupération d'un utilisateur par son ID.
  - [x] `createUser()` : création d'un utilisateur avec :
    - Vérification de l'unicité de l'email et du numéro de téléphone.
    - Chiffrement du mot de passe avec BCrypt.
    - Assignation automatique de `createdDate`.
    - Assignation des relations (Departement, Role, Position).
  - [x] `updateUser()` : mise à jour partielle (PATCH) avec vérification de l'unicité du numéro de téléphone en cas de changement.
  - [x] `deleteUser()` : suppression d'un utilisateur.

### Service Contrat (partiel - lecture + création)
- [x] `ContratService` :
  - [x] `getAllContrats()` : liste de tous les contrats.
  - [x] `getContratById()` : récupération d'un contrat par son ID.
  - [x] `createContrat()` : création d'un contrat lié à un utilisateur existant (vérification de l'existence de l'utilisateur).
- [ ] `updateContrat()` : non implémenté (décision métier : conserver l'historique des contrats).
- [ ] `deleteContrat()` : non implémenté (décision métier : ne pas supprimer les contrats historiques).

## Étape 4 : API Layer (Controllers) - Réalisé
- [x] `DepartementController` : endpoints testés via Bruno.
- [x] `RoleController` : endpoints testés.
- [x] `PositionController` : endpoints testés.
- [x] `UserController` :
  - [x] `GET /api/users` : liste des utilisateurs.
  - [x] `GET /api/users/{id}` : détail d'un utilisateur.
  - [x] `POST /api/users` : création d'un utilisateur.
  - [x] `PATCH /api/users/{id}` : mise à jour partielle.
  - [x] `DELETE /api/users/{id}` : suppression.
- [x] `ContratController` : endpoints pour la gestion des contrats (création et lecture).

## Prochaines Étapes (À venir)
### Services à compléter
- [ ] `LeaveService` (demandes de congé) : CRUD avec validation et statuts (EN_ATTENTE, APPROUVE, REFUSE).
- [ ] `PresenceService` (gestion des présences) : enregistrement des heures d'entrée/sortie.
- [ ] `EvaluationService` et `ObjectiveService` : évaluation des employés avec objectifs.

### Améliorations transversales
- [ ] Mise en place de la gestion globale des exceptions (`@ControllerAdvice`).
- [ ] Ajout de la validation des données (`@Valid`).
- [ ] Implémentation de l'authentification JWT (Spring Security).
- [ ] Intégration du service IA (FastAPI + Scikit-learn) pour la prédiction d'absentéisme.