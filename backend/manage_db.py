#!/usr/bin/env python
"""
Database Management Script for MSK Travels
Usage: python manage_db.py [command]
"""

import os
import sys
import subprocess
from datetime import datetime
from pathlib import Path

# Add the project directory to Python path
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'msk_travels.settings')

import django
django.setup()

from django.conf import settings
from django.core.management import execute_from_command_line

def backup_database():
    """Create a backup of the database"""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_dir = BASE_DIR / 'backups'
    backup_dir.mkdir(exist_ok=True)
    
    if settings.DATABASES['default']['ENGINE'] == 'django.db.backends.postgresql':
        # PostgreSQL backup
        backup_file = backup_dir / f'backup_{timestamp}.sql'
        db_settings = settings.DATABASES['default']
        
        cmd = [
            'pg_dump',
            '-h', db_settings['HOST'],
            '-p', str(db_settings['PORT']),
            '-U', db_settings['USER'],
            '-d', db_settings['NAME'],
            '-f', str(backup_file)
        ]
        
        env = os.environ.copy()
        env['PGPASSWORD'] = db_settings['PASSWORD']
        
        try:
            subprocess.run(cmd, env=env, check=True)
            print(f"✅ Database backup created: {backup_file}")
        except subprocess.CalledProcessError as e:
            print(f"❌ Backup failed: {e}")
            return False
    
    elif settings.DATABASES['default']['ENGINE'] == 'django.db.backends.sqlite3':
        # SQLite backup
        db_file = BASE_DIR / 'db.sqlite3'
        backup_file = backup_dir / f'backup_{timestamp}.sqlite3'
        
        try:
            import shutil
            shutil.copy2(db_file, backup_file)
            print(f"✅ Database backup created: {backup_file}")
        except Exception as e:
            print(f"❌ Backup failed: {e}")
            return False
    
    return True

def restore_database(backup_file):
    """Restore database from backup"""
    if not os.path.exists(backup_file):
        print(f"❌ Backup file not found: {backup_file}")
        return False
    
    if settings.DATABASES['default']['ENGINE'] == 'django.db.backends.postgresql':
        # PostgreSQL restore
        db_settings = settings.DATABASES['default']
        
        cmd = [
            'psql',
            '-h', db_settings['HOST'],
            '-p', str(db_settings['PORT']),
            '-U', db_settings['USER'],
            '-d', db_settings['NAME'],
            '-f', backup_file
        ]
        
        env = os.environ.copy()
        env['PGPASSWORD'] = db_settings['PASSWORD']
        
        try:
            subprocess.run(cmd, env=env, check=True)
            print(f"✅ Database restored from: {backup_file}")
        except subprocess.CalledProcessError as e:
            print(f"❌ Restore failed: {e}")
            return False
    
    elif settings.DATABASES['default']['ENGINE'] == 'django.db.backends.sqlite3':
        # SQLite restore
        db_file = BASE_DIR / 'db.sqlite3'
        
        try:
            import shutil
            shutil.copy2(backup_file, db_file)
            print(f"✅ Database restored from: {backup_file}")
        except Exception as e:
            print(f"❌ Restore failed: {e}")
            return False
    
    return True

def list_backups():
    """List available backups"""
    backup_dir = BASE_DIR / 'backups'
    if not backup_dir.exists():
        print("No backups directory found.")
        return
    
    backups = list(backup_dir.glob('backup_*'))
    if not backups:
        print("No backups found.")
        return
    
    print("Available backups:")
    for backup in sorted(backups, reverse=True):
        size = backup.stat().st_size
        size_mb = size / (1024 * 1024)
        print(f"  {backup.name} ({size_mb:.1f} MB)")

def check_database():
    """Check database connection and status"""
    try:
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            print("✅ Database connection successful")
        
        # Check table sizes
        if settings.DATABASES['default']['ENGINE'] == 'django.db.backends.postgresql':
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT schemaname, tablename, 
                           pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size 
                    FROM pg_tables 
                    WHERE schemaname = 'public' 
                    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
                """)
                results = cursor.fetchall()
                
                print("\nTable sizes:")
                for schema, table, size in results:
                    print(f"  {table}: {size}")
        
        elif settings.DATABASES['default']['ENGINE'] == 'django.db.backends.sqlite3':
            db_file = BASE_DIR / 'db.sqlite3'
            if db_file.exists():
                size = db_file.stat().st_size
                size_mb = size / (1024 * 1024)
                print(f"Database size: {size_mb:.1f} MB")
            else:
                print("❌ Database file not found")
    
    except Exception as e:
        print(f"❌ Database check failed: {e}")

def main():
    if len(sys.argv) < 2:
        print("""
Database Management Script for MSK Travels

Usage: python manage_db.py [command]

Commands:
  backup     - Create a database backup
  restore    - Restore database from backup (requires backup file path)
  list       - List available backups
  check      - Check database connection and status
  migrate    - Run database migrations
  shell      - Open Django shell
  help       - Show this help message

Examples:
  python manage_db.py backup
  python manage_db.py restore backups/backup_20231201_143022.sql
  python manage_db.py list
  python manage_db.py check
        """)
        return
    
    command = sys.argv[1]
    
    if command == 'backup':
        backup_database()
    
    elif command == 'restore':
        if len(sys.argv) < 3:
            print("❌ Please provide backup file path")
            print("Usage: python manage_db.py restore <backup_file>")
            return
        backup_file = sys.argv[2]
        restore_database(backup_file)
    
    elif command == 'list':
        list_backups()
    
    elif command == 'check':
        check_database()
    
    elif command == 'migrate':
        execute_from_command_line(['manage.py', 'migrate'])
    
    elif command == 'shell':
        execute_from_command_line(['manage.py', 'shell'])
    
    elif command == 'help':
        main()
    
    else:
        print(f"❌ Unknown command: {command}")
        main()

if __name__ == '__main__':
    main() 