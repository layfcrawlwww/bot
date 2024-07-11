import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class StartBot {
    public static void main(String[] args) {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder("node", "bot.js");
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }

            process.waitFor();
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }
}
