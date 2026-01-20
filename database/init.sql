-- Database initialization script
-- This runs when the PostgreSQL container starts

-- Create the portfolio database if it doesn't exist
SELECT 'CREATE DATABASE portfolio'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'portfolio');

-- Connect to portfolio database and run migrations
\c portfolio;

-- Run initial schema migration
\i /docker-entrypoint-initdb.d/migrations/001_initial_schema.sql
