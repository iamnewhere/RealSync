# RealSync - Real-Time Synchronous Music Player

Intructions (execute the following in terminal)- 

1. 'sudo chmod +x install.sh RealSync.sh'

2. 'sudo ./install.sh' (make sure your pc is connected to the internet)

3. './RealSync' to run the player and enjoy!!

-------------------------------------------------------------------------

To add your music files - 

1. Replace the resources/audio file with a symlink to the directory with your music files

Example commands - 
'rm resources/audio'
'ln -s full_path resources/audio'
(here full_path is the path to your music directory)