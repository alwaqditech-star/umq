# Role × Permission Matrix

| Permission                    | super-admin | admin | manager | editor  | hr  | viewer | employee | customer |
| ----------------------------- | :---------: | :---: | :-----: | :-----: | :-: | :----: | :------: | :------: |
| `*` (all)                     |     ✅      |   —   |    —    |    —    |  —  |   —    |    —     |    —     |
| users:read                    |     ✅      |  ✅   |   ✅    |    —    |  —  |   ✅   |    —     |    —     |
| users:create/update           |     ✅      |  ✅   |    —    |    —    |  —  |   —    |    —     |    —     |
| roles:read                    |     ✅      |  ✅   |    —    |    —    |  —  |   ✅   |    —     |    —     |
| services/projects/blog manage |     ✅      |  ✅   | partial | partial |  —  |  read  |    —     |    —     |
| jobs/applications             |     ✅      |  ✅   |  read   |    —    | ✅  |  read  |    —     |    —     |
| cms:read/manage               |     ✅      |  ✅   |   ✅    |   ✅    |  —  |  read  |   read   |    —     |
| settings:manage               |     ✅      |  ✅   |    —    |    —    |  —  |   —    |    —     |    —     |
| audit:read                    |     ✅      |  ✅   |    —    |    —    |  —  |   ✅   |    —     |    —     |

**Default admin home:** see `@umq/shared/rbac` `getDefaultAdminPath`.

**Seed users:** `admin@`, `editor@`, `hr@`, `viewer@`, `manager@`, `employee@` @ `umq.sa` — password from `SEED_ADMIN_PASSWORD`.
