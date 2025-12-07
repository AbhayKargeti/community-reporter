<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // Report permissions
            'view reports',
            'create reports',
            'edit own reports',
            'edit all reports',
            'delete own reports',
            'delete all reports',
            'assign reports',
            'change report status',

            // Comment permissions
            'create comments',
            'delete own comments',
            'delete all comments',

            // Vote permissions
            'vote on reports',

            // User management
            'manage users',
            'manage roles',

            // Admin functions
            'view audit log',
            'view dashboard stats',
            'bulk actions',
        ];

        foreach ($permissions as $permission) {
            Permission::create([
                'name' => $permission,
                'guard_name' => 'web'
            ]);
        }

        // Clear cache after creating permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create roles and assign permissions

        // Citizen role (default user)
        $citizen = Role::create(['name' => 'citizen']);
        $citizen->syncPermissions([
            'view reports',
            'create reports',
            'edit own reports',
            'delete own reports',
            'create comments',
            'delete own comments',
            'vote on reports',
        ]);

        // Staff role (municipality staff)
        $staff = Role::create(['name' => 'staff']);
        $staff->syncPermissions([
            'view reports',
            'create reports',
            'edit all reports',
            'create comments',
            'delete all comments',
            'change report status',
            'view audit log',
        ]);

        // Admin role (full access)
        $admin = Role::create(['name' => 'admin']);
        $admin->syncPermissions(Permission::all());

        // Create demo users with roles
        $adminUser = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);
        $adminUser->assignRole('admin');

        $staffUser1 = User::create([
            'name' => 'Staff Member',
            'email' => 'staff@example.com',
            'password' => Hash::make('password'),
            'role' => 'staff',
        ]);
        $staffUser1->assignRole('staff');

        $staffUser2 = User::create([
            'name' => 'John Staff',
            'email' => 'john.staff@example.com',
            'password' => Hash::make('password'),
            'role' => 'staff',
        ]);
        $staffUser2->assignRole('staff');

        $citizenUser1 = User::create([
            'name' => 'John Citizen',
            'email' => 'john@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);
        $citizenUser1->assignRole('citizen');

        $citizenUser2 = User::create([
            'name' => 'Jane Citizen',
            'email' => 'jane@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);
        $citizenUser2->assignRole('citizen');

        $this->command->info('Roles and permissions created successfully!');
        $this->command->info('Admin: admin@example.com / password');
        $this->command->info('Staff: staff@example.com / password');
        $this->command->info('Staff: john.staff@example.com / password');
        $this->command->info('Citizen: john@example.com / password');
        $this->command->info('Citizen: jane@example.com / password');
    }
}
