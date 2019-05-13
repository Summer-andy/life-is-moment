### Device supports x86, but APK only supports armeabi-v7a,arm64-v8a

### 
 ```
  在build.gradle(module:app)中的android {
    defaultConfig {
      ndk {
         abiFilters 'arm64-v8a', 'x86', 'armeabi-v7a'
       }
    }
  }

 ```

 ### 重新编译,即可在模拟器上运行。